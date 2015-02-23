
chatModule.
factory('ChattingService', [
'UserInformation',
function (UserInformation) {

    var thisFactory = {};


    var uniqueId = 0;
    var MAX_ID = Math.pow(2, 51);

    var getNextId = function () {
        var id = uniqueId++;
        if (uniqueId == MAX_ID) {
            uniqueId = -MAX_ID;
        }
        if (uniqueId == 0) {
            location.reload();
        }
        return id;
    }


    thisFactory.reset = function () {
        thisFactory.activeBoxes = [];
        thisFactory.passiveBoxes = [];
        thisFactory.lastMessages = [];
        thisFactory.numberOfUnreadMessages = 0;
        thisFactory.id = 0;
        thisFactory.loadedInbox = false;
    }

    thisFactory.reset();

    thisFactory.isActiveBoxOpened = function (user) {
        for (var i = 0; i < thisFactory.activeBoxes.length; i++) {
            var currentBox = thisFactory.activeBoxes[i];
            if (currentBox.with._id == user._id) {
                return true;
            }
        }
        return false;
    }

    thisFactory.getLastMessageOfConversation = function (conversationBox) {
        return conversationBox.messages[conversationBox.messages.length - 1];
    }

    thisFactory.createActiveConversationBox = function (user) {

        /*
            Search for a passive box. If it exists, make it active and return it.
         */
        for (var i = 0; i < thisFactory.passiveBoxes.length; i++) {
            var currentBox = thisFactory.passiveBoxes[i];
            if (currentBox.with._id == user._id) {
                thisFactory.activeBoxes.push(currentBox);
                thisFactory.passiveBoxes.splice(i, 1);
                return currentBox;
            }
        }

        /*
            Search for an active box. If it exists, return it.
         */
        for (var i = 0; i < thisFactory.activeBoxes.length; i++) {
            var currentBox = thisFactory.activeBoxes[i];
            if (currentBox.with._id == user._id) {
                // if box is already opened
                currentBox.checked = true;
                return currentBox;
            }
        }

        /*
            Else create a new box.
         */
        var newConversation = {
            with: user,
            checked: true,
            messages: [],
            id: thisFactory.id++,
            iVeReadIt: true
        };

        thisFactory.activeBoxes.push(newConversation);

        return newConversation;

    }

    var insertIntoLastMessages = function (from, to, message, _id) {

        for (var i = 0; i < thisFactory.lastMessages.length; i++) {
            var currentMsg = thisFactory.lastMessages[i];
            if (currentMsg.from._id == to._id || currentMsg.to._id == to._id) {
                thisFactory.lastMessages.splice(i, 1);
                break;
            }
        }

        thisFactory.lastMessages.unshift({
            from: from,
            to: to,
            date: new Date(),
            message: message,
            read: false,
            _id: getNextId()
        });

    }

    thisFactory.addReceivedMessage = function (data) {

        var box = thisFactory.createActiveConversationBox(data.from);
        box.messages.push({
            from: data.from,
            message: data.message,
            date: data.date,
            _id: getNextId()
        });
        box.iVeReadIt = false;

        insertIntoLastMessages(
            data.from,
            {_id: UserInformation.user._id, username: UserInformation.user.username, email: UserInformation.user.email},
            data.message
        );

        if (typeof box.onMessageReceived === 'function') {
            box.onMessageReceived();
        }

    }

    thisFactory.addOwnSentMessage = function (conversationBox, from, to, message) {
        conversationBox.messages.push({
            from: from,
            message: message,
            date: new Date(),
            _id: getNextId()
        });
        conversationBox.iVeReadIt = true;
        insertIntoLastMessages(from, to, message);
    }

    thisFactory.deleteConversationBox = function (conversation) {
        for (var i = 0; i < thisFactory.activeBoxes.length; i++) {
            var currentBox = thisFactory.activeBoxes[i];
            if (conversation.id == currentBox.id) {
                thisFactory.passiveBoxes.push(currentBox);
                thisFactory.activeBoxes.splice(i, 1);
                break;
            }
        }
    }

    thisFactory.removeAllBoxes = function () {
        thisFactory.activeBoxes = thisFactory.activeBoxes.concat(thisFactory.passiveBoxes);
        thisFactory.passiveBoxes = [];
    }

    thisFactory.markBoxAsRead = function (conversationBox) {
        conversationBox.iVeReadIt = true;
    }

    thisFactory.getNumberOfUnreadConversations = function () {
        var n = 0;

        for (var i = 0; i < thisFactory.activeBoxes.length; i++) {
            if (!thisFactory.activeBoxes[i].iVeReadIt) {
                n++;
            }
        }

        for (var i = 0; i < thisFactory.passiveBoxes.length; i++) {
            if (!thisFactory.passiveBoxes[i].iVeReadIt) {
                n++;
            }
        }

        return n;
    }

    var existsConversationInInbox = function (userId) {

        for (var i = 0; i < thisFactory.lastMessages.length; i++) {
            var message = thisFactory.lastMessages[i];
            if (message.from._id == userId || message.to._id == userId) {
                return true;
            }
        }

        return false;

    }

    var setUnreadMessages = function (conversation, box) {
        var lastMessageOfConversation = conversation[conversation.length - 1];

        if (lastMessageOfConversation.to._id == UserInformation.user._id && !lastMessageOfConversation.read) {
            // if the last message of conversation was sent to current user and it wasn't read
            box.iVeReadIt = false;
        }

        thisFactory.lastMessages.push(lastMessageOfConversation);

    }

    thisFactory.inboxLength = function () {
        return thisFactory.lastMessages.length;
    }

    var inboxListSubscriberFunctions = [];
    thisFactory.iWantToBeNotifiedWhenInboxReachesEndOfList = function (callback) {
        inboxListSubscriberFunctions.push(callback);
    }

    thisFactory.updatePassiveBoxes = function (inboxGroupedByUser) {

        if (inboxGroupedByUser.length == 0) {
            for (var i = 0; i < inboxListSubscriberFunctions.length; i++) {
                var callback = inboxListSubscriberFunctions[i];
                if (typeof callback === 'function') {
                    callback();
                }
            }
        }

        for (var i = 0; i < inboxGroupedByUser.length; i++) {

            var conversationWithUser = inboxGroupedByUser[i];

            var conversationPartner;
            if (conversationWithUser.data[0].from._id != UserInformation.user._id) {
                conversationPartner = conversationWithUser.data[0].from;
            }
            else if (conversationWithUser.data[0].to._id != UserInformation.user._id) {
                conversationPartner = conversationWithUser.data[0].to;
            }

            if (existsConversationInInbox(conversationPartner._id)) {
                // if box already exists, don't add a new box for this user
                continue;
            }

            var newBox = {
                with: conversationPartner,
                checked: true,
                messages: [],
                id: thisFactory.id++,
                iVeReadIt: true
            };

            setUnreadMessages(conversationWithUser.data, newBox);

            thisFactory.passiveBoxes.push(newBox);

            newBox.messages = conversationWithUser.data;
        }

        thisFactory.loadedInbox = true;

    }

    return thisFactory;

}
]);
