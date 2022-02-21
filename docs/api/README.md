# Documentation for RemindMe API

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *http://*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*EventApi* | [**deleteEvent**](api/Apis/EventApi.md#deleteevent) | **DELETE** /event/{eventId} | Deletes an event
*EventApi* | [**findEventById**](api/Apis/EventApi.md#findeventbyid) | **GET** /event/{eventId} | Finds a event by id
*EventApi* | [**getAllEvents**](api/Apis/EventApi.md#getallevents) | **GET** /events | Get all events
*EventApi* | [**setNewEvent**](api/Apis/EventApi.md#setnewevent) | **POST** /event | Add new event
*EventApi* | [**updateEvent**](api/Apis/EventApi.md#updateevent) | **PUT** /event/{eventId} | Updates an existing event
*SettingsApi* | [**getSettings**](api/Apis/SettingsApi.md#getsettings) | **GET** /settings | Get settings
*SettingsApi* | [**updateSettings**](api/Apis/SettingsApi.md#updatesettings) | **PUT** /settings | Update settings
*SubscriberApi* | [**deleteSubscriberById**](api/Apis/SubscriberApi.md#deletesubscriberbyid) | **DELETE** /subscriber/{id} | Deletes an subscriber by id
*SubscriberApi* | [**deleteSubscriberByToken**](api/Apis/SubscriberApi.md#deletesubscriberbytoken) | **DELETE** /subscriber/{token} | Deletes an subscriber by token
*SubscriberApi* | [**findSubscriberByToken**](api/Apis/SubscriberApi.md#findsubscriberbytoken) | **GET** /subscriber/{token} | Find a subscriber by token
*SubscriberApi* | [**getAllSubscriber**](api/Apis/SubscriberApi.md#getallsubscriber) | **GET** /subscribers | Get all subscriber
*SubscriberApi* | [**setNewSubscriberAdmin**](api/Apis/SubscriberApi.md#setnewsubscriberadmin) | **POST** /subscriber | Add new subscriber
*SubscriberApi* | [**setNewSubscriberOpen**](api/Apis/SubscriberApi.md#setnewsubscriberopen) | **POST** /subscribe | Add new subscriber
*SubscriberApi* | [**updateSubscriberById**](api/Apis/SubscriberApi.md#updatesubscriberbyid) | **PUT** /subscriber/{id} | Updates an existing subscriber
*SubscriberApi* | [**updateSubscriberByToken**](api/Apis/SubscriberApi.md#updatesubscriberbytoken) | **PUT** /subscriber/{token} | Updates an existing subscriber


<a name="documentation-for-api/Models/"></a>
## Documentation for api/Models/

 - [Error](api/Models/Error.md)
 - [Event](api/Models/Event.md)
 - [Settings](api/Models/Settings.md)
 - [Subscriber](api/Models/Subscriber.md)


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

