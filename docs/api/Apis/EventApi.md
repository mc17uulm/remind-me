# EventApi

All URIs are relative to *http://*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteEvent**](api/Apis/EventApi.md#deleteEvent) | **DELETE** /event/{eventId} | Deletes an event
[**findEventById**](api/Apis/EventApi.md#findEventById) | **GET** /event/{eventId} | Finds a event by id
[**getAllEvents**](api/Apis/EventApi.md#getAllEvents) | **GET** /events | Get all events
[**setNewEvent**](api/Apis/EventApi.md#setNewEvent) | **POST** /event | Add new event
[**updateEvent**](api/Apis/EventApi.md#updateEvent) | **PUT** /event/{eventId} | Updates an existing event


<a name="deleteEvent"></a>
# **deleteEvent**
> Boolean deleteEvent(eventId)

Deletes an event

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **eventId** | **Long**|  | [default to null]

### Return type

[**Boolean**](api/Models/boolean.md)

### Authorization

[cookie](api/README.md#cookie), [nonce](api/README.md#nonce)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="findEventById"></a>
# **findEventById**
> event findEventById(eventId)

Finds a event by id

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **eventId** | **Long**|  | [default to null]

### Return type

[**event**](api/Models/event.md)

### Authorization

[cookie](api/README.md#cookie), [nonce](api/README.md#nonce)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getAllEvents"></a>
# **getAllEvents**
> List getAllEvents()

Get all events

### Parameters
This endpoint does not need any parameter.

### Return type

[**List**](api/Models/event.md)

### Authorization

[cookie](api/README.md#cookie), [nonce](api/README.md#nonce)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="setNewEvent"></a>
# **setNewEvent**
> BigDecimal setNewEvent(Event)

Add new event

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Event** | [**Event**](api/Models/Event.md)| Event object | [optional]

### Return type

[**BigDecimal**](api/Models/number.md)

### Authorization

[cookie](api/README.md#cookie), [nonce](api/README.md#nonce)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="updateEvent"></a>
# **updateEvent**
> Boolean updateEvent(eventId, Event)

Updates an existing event

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **eventId** | **Long**|  | [default to null]
 **Event** | [**Event**](api/Models/Event.md)| Event object | [optional]

### Return type

[**Boolean**](api/Models/boolean.md)

### Authorization

[cookie](api/README.md#cookie), [nonce](api/README.md#nonce)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

