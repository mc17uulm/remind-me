# EventApi

All URIs are relative to *http://}*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteEvent**](EventApi.md#deleteEvent) | **DELETE** /event/{eventId} | Deletes an event
[**findEventById**](EventApi.md#findEventById) | **GET** /event/{eventId} | Finds a event by id
[**getAllEvents**](EventApi.md#getAllEvents) | **GET** /events | Get all events
[**setNewEvent**](EventApi.md#setNewEvent) | **POST** /event | Add new event
[**updateEvent**](EventApi.md#updateEvent) | **PUT** /event/{eventId} | Updates an existing event


<a name="deleteEvent"></a>
# **deleteEvent**
> Boolean deleteEvent(eventId)

Deletes an event

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **eventId** | **Long**|  | [default to null]

### Return type

[**Boolean**](../Models/boolean.md)

### Authorization

[cookie](../README.md#cookie), [nonce](../README.md#nonce)

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

[**event**](../Models/event.md)

### Authorization

[cookie](../README.md#cookie), [nonce](../README.md#nonce)

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

[**List**](../Models/event.md)

### Authorization

[cookie](../README.md#cookie), [nonce](../README.md#nonce)

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
 **Event** | [**Event**](../Models/Event.md)| Event object | [optional]

### Return type

[**BigDecimal**](../Models/number.md)

### Authorization

[cookie](../README.md#cookie), [nonce](../README.md#nonce)

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
 **Event** | [**Event**](../Models/Event.md)| Event object | [optional]

### Return type

[**Boolean**](../Models/boolean.md)

### Authorization

[cookie](../README.md#cookie), [nonce](../README.md#nonce)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

