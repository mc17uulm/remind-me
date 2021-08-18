# Documentation for RemindMe API

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *http://}*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*EventApi* | [**deleteEvent**](Apis/EventApi.md#deleteevent) | **DELETE** /event/{eventId} | Deletes an event
*EventApi* | [**findEventById**](Apis/EventApi.md#findeventbyid) | **GET** /event/{eventId} | Finds a event by id
*EventApi* | [**getAllEvents**](Apis/EventApi.md#getallevents) | **GET** /events | Get all events
*EventApi* | [**setNewEvent**](Apis/EventApi.md#setnewevent) | **POST** /event | Add new event
*EventApi* | [**updateEvent**](Apis/EventApi.md#updateevent) | **PUT** /event/{eventId} | Updates an existing event
*SettingsApi* | [**getSettings**](Apis/SettingsApi.md#getsettings) | **GET** /settings | Get settings
*SettingsApi* | [**updateSettings**](Apis/SettingsApi.md#updatesettings) | **PUT** /settings | Update settings
*SubscriberApi* | [**deleteSubscriberById**](Apis/SubscriberApi.md#deletesubscriberbyid) | **DELETE** /subscriber/{id} | Deletes an subscriber by id
*SubscriberApi* | [**deleteSubscriberByToken**](Apis/SubscriberApi.md#deletesubscriberbytoken) | **DELETE** /subscriber/{token} | Deletes an subscriber by token
*SubscriberApi* | [**findSubscriberByToken**](Apis/SubscriberApi.md#findsubscriberbytoken) | **GET** /subscriber/{token} | Find a subscriber by token
*SubscriberApi* | [**getAllSubscriber**](Apis/SubscriberApi.md#getallsubscriber) | **GET** /subscribers | Get all subscriber
*SubscriberApi* | [**setNewSubscriberAdmin**](Apis/SubscriberApi.md#setnewsubscriberadmin) | **POST** /subscriber | Add new subscriber
*SubscriberApi* | [**setNewSubscriberOpen**](Apis/SubscriberApi.md#setnewsubscriberopen) | **POST** /subscribe | Add new subscriber
*SubscriberApi* | [**updateSubscriberById**](Apis/SubscriberApi.md#updatesubscriberbyid) | **PUT** /subscriber/{id} | Updates an existing subscriber
*SubscriberApi* | [**updateSubscriberByToken**](Apis/SubscriberApi.md#updatesubscriberbytoken) | **PUT** /subscriber/{token} | Updates an existing subscriber


<a name="documentation-for-models"></a>
## Documentation for Models

 - [Error](Modelsrror.md)
 - [Event](Modelsvent.md)
 - [Settings](Modelsettings.md)
 - [Subscriber](Modelsubscriber.md)


<a name="documentation-for-authorization"></a>
## Documentation for Authorization

<a name="cookie"></a>
### cookie

- **Type**: API key
- **API key parameter name**: wordpress_logged_in_{token}
- **Location**: 

<a name="nonce"></a>
### nonce

- **Type**: API key
- **API key parameter name**: X-WP-Nonce
- **Location**: HTTP header

