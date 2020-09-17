exports.id = "main";
exports.modules = {

/***/ "./src/schema/card/cardResolvers/cardMutations/createUserCard.ts":
/*!***********************************************************************!*\
  !*** ./src/schema/card/cardResolvers/cardMutations/createUserCard.ts ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var server_serverError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! server/serverError */ "./src/server/serverError.ts");
/* harmony import */ var _cardUtils_cardInfo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../cardUtils/cardInfo */ "./src/schema/card/cardUtils/cardInfo.ts");
/* harmony import */ var _cardUtils_cardUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../cardUtils/cardUtils */ "./src/schema/card/cardUtils/cardUtils.ts");



/* harmony default export */ __webpack_exports__["default"] = (async (parent, args, { passport, prisma, pubsub }) => {
    try {
        const { category, isFavorite, isToDo, title, url, } = args.data;
        const type = await Object(_cardUtils_cardUtils__WEBPACK_IMPORTED_MODULE_2__["getCardType"])(url);
        const userId = passport.getUserId();
        const createArgs = await Object(_cardUtils_cardUtils__WEBPACK_IMPORTED_MODULE_2__["getUserCardCreateArgs"])(url);
        const finalArgs = {
            ...args,
            data: {
                cardData: {
                    create: { ...createArgs },
                },
                category,
                isFavorite,
                isToDo,
                title,
                type,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        };
        const card = await prisma.mutation.createCard(finalArgs, _cardUtils_cardInfo__WEBPACK_IMPORTED_MODULE_1__["default"]);
        pubsub.publish('userCard', { userCard: card });
        return card;
    }
    catch (error) {
        throw new server_serverError__WEBPACK_IMPORTED_MODULE_0__["default"]({ message: error.message, status: 400 });
    }
});


/***/ }),

/***/ "./src/schema/card/cardResolvers/cardMutations/initiateUserCard.ts":
/*!*************************************************************************!*\
  !*** ./src/schema/card/cardResolvers/cardMutations/initiateUserCard.ts ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var server_serverError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! server/serverError */ "./src/server/serverError.ts");
/* harmony import */ var schema_card_cardUtils_cardEnums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! schema/card/cardUtils/cardEnums */ "./src/schema/card/cardUtils/cardEnums.ts");
/* harmony import */ var _cardUtils_cardUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../cardUtils/cardUtils */ "./src/schema/card/cardUtils/cardUtils.ts");



/* harmony default export */ __webpack_exports__["default"] = (async (parent, args) => {
    try {
        const { url } = args.data;
        const cardType = await Object(_cardUtils_cardUtils__WEBPACK_IMPORTED_MODULE_2__["getCardType"])(args.data.url);
        if (cardType === schema_card_cardUtils_cardEnums__WEBPACK_IMPORTED_MODULE_1__["type"].image) {
            return Object(_cardUtils_cardUtils__WEBPACK_IMPORTED_MODULE_2__["getInitialImageData"])(args.data.url);
        }
        if (cardType === schema_card_cardUtils_cardEnums__WEBPACK_IMPORTED_MODULE_1__["type"].youtube) {
            const initialYoutubeData = await Object(_cardUtils_cardUtils__WEBPACK_IMPORTED_MODULE_2__["getInitialYoutubeData"])(url);
            return initialYoutubeData;
        }
        throw Error('Cannot detect a valid card type');
    }
    catch (error) {
        throw new server_serverError__WEBPACK_IMPORTED_MODULE_0__["default"]({ message: error.message, status: 400 });
    }
});


/***/ }),

/***/ "./src/schema/card/cardUtils/cardUtils.ts":
/*!************************************************!*\
  !*** ./src/schema/card/cardUtils/cardUtils.ts ***!
  \************************************************/
/*! exports provided: getCardType, getInitialImageData, getInitialYoutubeData, getUserCardCreateArgs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCardType", function() { return getCardType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getInitialImageData", function() { return getInitialImageData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getInitialYoutubeData", function() { return getInitialYoutubeData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getUserCardCreateArgs", function() { return getUserCardCreateArgs; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var youtube_youtube__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! youtube/youtube */ "./src/thirdParty/youtube/youtube.ts");
/* harmony import */ var schema_card_cardUtils_cardEnums__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! schema/card/cardUtils/cardEnums */ "./src/schema/card/cardUtils/cardEnums.ts");



// ----- CARD TYPE ----- //
const getCardType = async (url) => {
    if (url.includes('youtube.com')
        || url.includes('youtu.be')
        || url.includes('youtube-nocookie.com')) {
        return schema_card_cardUtils_cardEnums__WEBPACK_IMPORTED_MODULE_2__["type"].youtube;
    }
    const response = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.head(url);
    const contentType = response.headers['content-type'];
    console.log(['image/jpeg', 'image/png', 'image/gif'].includes(contentType));
    if (['image/jpeg', 'image/png', 'image/gif'].includes(contentType)) {
        return schema_card_cardUtils_cardEnums__WEBPACK_IMPORTED_MODULE_2__["type"].image;
    }
    throw Error('Cannot detect a valid card type');
};
// ----- IMAGE DATA ----- //
const getImageData = (url) => ({
    imageUrl: url,
});
// ----- INITIAL DATA ----- //
const getInitialImageData = (url) => {
    const imageData = getImageData(url);
    return {
        cardData: {
            imageCardData: { ...imageData },
        },
        category: schema_card_cardUtils_cardEnums__WEBPACK_IMPORTED_MODULE_2__["category"].image,
        type: schema_card_cardUtils_cardEnums__WEBPACK_IMPORTED_MODULE_2__["type"].image,
        url,
    };
};
const getInitialYoutubeData = async (url) => {
    const youtubeVideoData = await youtube_youtube__WEBPACK_IMPORTED_MODULE_1__["default"].getYoutubeVideoData(url);
    return {
        cardData: {
            youtubeCardData: youtubeVideoData,
        },
        category: schema_card_cardUtils_cardEnums__WEBPACK_IMPORTED_MODULE_2__["category"].video,
        title: youtubeVideoData.videoTitle,
        type: schema_card_cardUtils_cardEnums__WEBPACK_IMPORTED_MODULE_2__["type"].youtube,
        url,
    };
};
// ----- CREATE CARD ----- //
const getUserCardCreateArgs = async (url) => {
    const cardType = getCardType(url);
    if (cardType === schema_card_cardUtils_cardEnums__WEBPACK_IMPORTED_MODULE_2__["type"].image) {
        const imageData = getImageData(url);
        return {
            imageCardData: {
                create: { ...imageData },
            },
        };
    }
    if (cardType === schema_card_cardUtils_cardEnums__WEBPACK_IMPORTED_MODULE_2__["type"].youtube) {
        const youtubeVideoData = await youtube_youtube__WEBPACK_IMPORTED_MODULE_1__["default"].getYoutubeVideoData(url);
        return {
            youtubeCardData: {
                create: { ...youtubeVideoData },
            },
        };
    }
    throw new Error('invalid card type');
};


/***/ })

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvc2NoZW1hL2NhcmQvY2FyZFJlc29sdmVycy9jYXJkTXV0YXRpb25zL2NyZWF0ZVVzZXJDYXJkLnRzIiwid2VicGFjazovLy8uL3NyYy9zY2hlbWEvY2FyZC9jYXJkUmVzb2x2ZXJzL2NhcmRNdXRhdGlvbnMvaW5pdGlhdGVVc2VyQ2FyZC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NoZW1hL2NhcmQvY2FyZFV0aWxzL2NhcmRVdGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQTZDO0FBQ0c7QUFDK0I7QUFFaEUsb0VBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFO0lBQ2xFLElBQUk7UUFDRixNQUFNLEVBQ0osUUFBUSxFQUNSLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUNMLEdBQUcsR0FDSixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFFZCxNQUFNLElBQUksR0FBRyxNQUFNLHdFQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFcEMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBRXBDLE1BQU0sVUFBVSxHQUFHLE1BQU0sa0ZBQXFCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFcEQsTUFBTSxTQUFTLEdBQUc7WUFDaEIsR0FBRyxJQUFJO1lBQ1AsSUFBSSxFQUFFO2dCQUNKLFFBQVEsRUFBRTtvQkFDUixNQUFNLEVBQUUsRUFBRSxHQUFHLFVBQVUsRUFBRTtpQkFDMUI7Z0JBQ0QsUUFBUTtnQkFDUixVQUFVO2dCQUNWLE1BQU07Z0JBQ04sS0FBSztnQkFDTCxJQUFJO2dCQUNKLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUU7d0JBQ1AsRUFBRSxFQUFFLE1BQU07cUJBQ1g7aUJBQ0Y7YUFDRjtTQUNGLENBQUM7UUFFRixNQUFNLElBQUks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QUFnQixFQUFFO2FBQ2hDO1NBQ0YsQ0FBQztLQUNIO0lBRUQsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3ZDLENBQUMsQ0FBQyIsImZpbGUiOiJtYWluLjQ4OGVlOTcxYjc0OTg3MTRhNjY4LmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmVyRXJyb3IgZnJvbSAnc2VydmVyL3NlcnZlckVycm9yJztcbmltcG9ydCBjYXJkSW5mbyBmcm9tICcuLi8uLi9jYXJkVXRpbHMvY2FyZEluZm8nO1xuaW1wb3J0IHsgZ2V0Q2FyZFR5cGUsIGdldFVzZXJDYXJkQ3JlYXRlQXJncyB9IGZyb20gJy4uLy4uL2NhcmRVdGlscy9jYXJkVXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyAocGFyZW50LCBhcmdzLCB7IHBhc3Nwb3J0LCBwcmlzbWEsIHB1YnN1YiB9KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qge1xuICAgICAgY2F0ZWdvcnksXG4gICAgICBpc0Zhdm9yaXRlLFxuICAgICAgaXNUb0RvLFxuICAgICAgdGl0bGUsXG4gICAgICB1cmwsXG4gICAgfSA9IGFyZ3MuZGF0YTtcblxuICAgIGNvbnN0IHR5cGUgPSBhd2FpdCBnZXRDYXJkVHlwZSh1cmwpO1xuXG4gICAgY29uc3QgdXNlcklkID0gcGFzc3BvcnQuZ2V0VXNlcklkKCk7XG5cbiAgICBjb25zdCBjcmVhdGVBcmdzID0gYXdhaXQgZ2V0VXNlckNhcmRDcmVhdGVBcmdzKHVybCk7XG5cbiAgICBjb25zdCBmaW5hbEFyZ3MgPSB7XG4gICAgICAuLi5hcmdzLFxuICAgICAgZGF0YToge1xuICAgICAgICBjYXJkRGF0YToge1xuICAgICAgICAgIGNyZWF0ZTogeyAuLi5jcmVhdGVBcmdzIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGNhdGVnb3J5LFxuICAgICAgICBpc0Zhdm9yaXRlLFxuICAgICAgICBpc1RvRG8sXG4gICAgICAgIHRpdGxlLFxuICAgICAgICB0eXBlLFxuICAgICAgICB1c2VyOiB7XG4gICAgICAgICAgY29ubmVjdDoge1xuICAgICAgICAgICAgaWQ6IHVzZXJJZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgY29uc3QgY2FyZCA9IGF3YWl0IHByaXNtYS5tdXRhdGlvbi5jcmVhdGVDYXJkKGZpbmFsQXJncywgY2FyZEluZm8pO1xuICAgIHB1YnN1Yi5wdWJsaXNoKCd1c2VyQ2FyZCcsIHsgdXNlckNhcmQ6IGNhcmQgfSk7XG4gICAgcmV0dXJuIGNhcmQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgbmV3IFNlcnZlckVycm9yKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSwgc3RhdHVzOiA0MDAgfSk7XG4gIH1cbn07XG4iLCJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuaW1wb3J0IFNlcnZlckVycm9yIGZyb20gJ3NlcnZlci9zZXJ2ZXJFcnJvcic7XG5pbXBvcnQgeyB0eXBlIH0gZnJvbSAnc2NoZW1hL2NhcmQvY2FyZFV0aWxzL2NhcmRFbnVtcyc7XG5pbXBvcnQgeyBnZXRDYXJkVHlwZSwgZ2V0SW5pdGlhbEltYWdlRGF0YSwgZ2V0SW5pdGlhbFlvdXR1YmVEYXRhIH0gZnJvbSAnLi4vLi4vY2FyZFV0aWxzL2NhcmRVdGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIChwYXJlbnQsIGFyZ3MpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IHVybCB9ID0gYXJncy5kYXRhO1xuXG4gICAgY29uc3QgY2FyZFR5cGUgPSBhd2FpdCBnZXRDYXJkVHlwZShhcmdzLmRhdGEudXJsKTtcblxuICAgIGlmIChjYXJkVHlwZSA9PT0gdHlwZS5pbWFnZSkge1xuICAgICAgcmV0dXJuIGdldEluaXRpYWxJbWFnZURhdGEoYXJncy5kYXRhLnVybCk7XG4gICAgfVxuXG4gICAgaWYgKGNhcmRUeXBlID09PSB0eXBlLnlvdXR1YmUpIHtcbiAgICAgIGNvbnN0IGluaXRpYWxZb3V0dWJlRGF0YSA9IGF3YWl0IGdldEluaXRpYWxZb3V0dWJlRGF0YSh1cmwpO1xuICAgICAgcmV0dXJuIGluaXRpYWxZb3V0dWJlRGF0YTtcbiAgICB9XG5cbiAgICB0aHJvdyBFcnJvcignQ2Fubm90IGRldGVjdCBhIHZhbGlkIGNhcmQgdHlwZScpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHRocm93IG5ldyBTZXJ2ZXJFcnJvcih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsIHN0YXR1czogNDAwIH0pO1xuICB9XG59O1xuIiwiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcbmltcG9ydCB5b3V0dWJlIGZyb20gJ3lvdXR1YmUveW91dHViZSc7XG5pbXBvcnQgeyBjYXRlZ29yeSwgdHlwZSB9IGZyb20gJ3NjaGVtYS9jYXJkL2NhcmRVdGlscy9jYXJkRW51bXMnO1xuaW1wb3J0IHtcbiAgQ2FyZENyZWF0ZUFyZ3MsXG4gIENhcmRUeXBlLFxuICBJbWFnZURhdGEsXG4gIEluaXRpYWxDYXJkRGF0YVNjaGVtYSxcbn0gZnJvbSAnLi9jYXJkVHlwZXMnO1xuXG4vLyAtLS0tLSBDQVJEIFRZUEUgLS0tLS0gLy9cblxuZXhwb3J0IGNvbnN0IGdldENhcmRUeXBlID0gYXN5bmMgKHVybDogc3RyaW5nKTogUHJvbWlzZTxDYXJkVHlwZT4gPT4ge1xuICBpZiAoXG4gICAgdXJsLmluY2x1ZGVzKCd5b3V0dWJlLmNvbScpXG4gICAgfHwgdXJsLmluY2x1ZGVzKCd5b3V0dS5iZScpXG4gICAgfHwgdXJsLmluY2x1ZGVzKCd5b3V0dWJlLW5vY29va2llLmNvbScpXG4gICkge1xuICAgIHJldHVybiB0eXBlLnlvdXR1YmU7XG4gIH1cblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmhlYWQodXJsKTtcbiAgY29uc3QgY29udGVudFR5cGUgPSByZXNwb25zZS5oZWFkZXJzWydjb250ZW50LXR5cGUnXTtcblxuICBjb25zb2xlLmxvZyhbJ2ltYWdlL2pwZWcnLCAnaW1hZ2UvcG5nJywgJ2ltYWdlL2dpZiddLmluY2x1ZGVzKGNvbnRlbnRUeXBlKTtcblxuICBpZiAoWydpbWFnZS9qcGVnJywgJ2ltYWdlL3BuZycsICdpbWFnZS9naWYnXS5pbmNsdWRlcyhjb250ZW50VHlwZSkpIHtcbiAgICByZXR1cm4gdHlwZS5pbWFnZTtcbiAgfVxuXG4gIHRocm93IEVycm9yKCdDYW5ub3QgZGV0ZWN0IGEgdmFsaWQgY2FyZCB0eXBlJyk7XG59O1xuXG4vLyAtLS0tLSBJTUFHRSBEQVRBIC0tLS0tIC8vXG5cbmNvbnN0IGdldEltYWdlRGF0YSA9ICh1cmw6IHN0cmluZyk6IEltYWdlRGF0YSA9PiAoe1xuICBpbWFnZVVybDogdXJsLFxufSk7XG5cbi8vIC0tLS0tIElOSVRJQUwgREFUQSAtLS0tLSAvL1xuXG5leHBvcnQgY29uc3QgZ2V0SW5pdGlhbEltYWdlRGF0YSA9ICh1cmw6IHN0cmluZyk6IEluaXRpYWxDYXJkRGF0YVNjaGVtYSA9PiB7XG4gIGNvbnN0IGltYWdlRGF0YSA9IGdldEltYWdlRGF0YSh1cmwpO1xuXG4gIHJldHVybiB7XG4gICAgY2FyZERhdGE6IHtcbiAgICAgIGltYWdlQ2FyZERhdGE6IHsgLi4uaW1hZ2VEYXRhIH0sXG4gICAgfSxcbiAgICBjYXRlZ29yeTogY2F0ZWdvcnkuaW1hZ2UsXG4gICAgdHlwZTogdHlwZS5pbWFnZSxcbiAgICB1cmwsXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0SW5pdGlhbFlvdXR1YmVEYXRhID0gYXN5bmMgKHVybDogc3RyaW5nKTogUHJvbWlzZTxJbml0aWFsQ2FyZERhdGFTY2hlbWE+ID0+IHtcbiAgY29uc3QgeW91dHViZVZpZGVvRGF0YSA9IGF3YWl0IHlvdXR1YmUuZ2V0WW91dHViZVZpZGVvRGF0YSh1cmwpO1xuXG4gIHJldHVybiB7XG4gICAgY2FyZERhdGE6IHtcbiAgICAgIHlvdXR1YmVDYXJkRGF0YTogeW91dHViZVZpZGVvRGF0YSxcbiAgICB9LFxuICAgIGNhdGVnb3J5OiBjYXRlZ29yeS52aWRlbyxcbiAgICB0aXRsZTogeW91dHViZVZpZGVvRGF0YS52aWRlb1RpdGxlLFxuICAgIHR5cGU6IHR5cGUueW91dHViZSxcbiAgICB1cmwsXG4gIH07XG59O1xuXG4vLyAtLS0tLSBDUkVBVEUgQ0FSRCAtLS0tLSAvL1xuXG5leHBvcnQgY29uc3QgZ2V0VXNlckNhcmRDcmVhdGVBcmdzID0gYXN5bmMgKHVybDogc3RyaW5nKTogUHJvbWlzZTxDYXJkQ3JlYXRlQXJncz4gPT4ge1xuICBjb25zdCBjYXJkVHlwZSA9IGdldENhcmRUeXBlKHVybCk7XG5cbiAgaWYgKGNhcmRUeXBlID09PSB0eXBlLmltYWdlKSB7XG4gICAgY29uc3QgaW1hZ2VEYXRhID0gZ2V0SW1hZ2VEYXRhKHVybCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgaW1hZ2VDYXJkRGF0YToge1xuICAgICAgICBjcmVhdGU6IHsgLi4uaW1hZ2VEYXRhIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBpZiAoY2FyZFR5cGUgPT09IHR5cGUueW91dHViZSkge1xuICAgIGNvbnN0IHlvdXR1YmVWaWRlb0RhdGEgPSBhd2FpdCB5b3V0dWJlLmdldFlvdXR1YmVWaWRlb0RhdGEodXJsKTtcblxuICAgIHJldHVybiB7XG4gICAgICB5b3V0dWJlQ2FyZERhdGE6IHtcbiAgICAgICAgY3JlYXRlOiB7IC4uLnlvdXR1YmVWaWRlb0RhdGEgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjYXJkIHR5cGUnKTtcbn07XG4iXSwic291cmNlUm9vdCI6IiJ9