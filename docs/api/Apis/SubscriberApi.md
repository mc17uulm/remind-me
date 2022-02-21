# SubscriberApi

All URIs are relative to *http://}*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteSubscriberById**](api/Apis/SubscriberApi.md#deleteSubscriberById) | **DELETE** /subscriber/{id} | Deletes an subscriber by id
[**deleteSubscriberByToken**](api/Apis/SubscriberApi.md#deleteSubscriberByToken) | **DELETE** /subscriber/{token} | Deletes an subscriber by token
[**findSubscriberByToken**](api/Apis/SubscriberApi.md#findSubscriberByToken) | **GET** /subscriber/{token} | Find a subscriber by token
[**getAllSubscriber**](api/Apis/SubscriberApi.md#getAllSubscriber) | **GET** /subscribers | Get all subscriber
[**setNewSubscriberAdmin**](api/Apis/SubscriberApi.md#setNewSubscriberAdmin) | **POST** /subscriber | Add new subscriber
[**setNewSubscriberOpen**](api/Apis/SubscriberApi.md#setNewSubscriberOpen) | **POST** /subscribe | Add new subscriber
[**updateSubscriberById**](api/Apis/SubscriberApi.md#updateSubscriberById) | **PUT** /subscriber/{id} | Updates an existing subscriber
[**updateSubscriberByToken**](api/Apis/SubscriberApi.md#updateSubscriberByToken) | **PUT** /subscriber/{token} | Updates an existing subscriber


<a name="deleteSubscriberById"></a>
# **deleteSubscriberById**
> Boolean deleteSubscriberById(id)

Deletes an subscriber by id

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Long**|  | [default to null]

### Return type

[**Boolean**](api/Models/boolean.md)

### Authorization

[cookie](api/README.md#cookie), [nonce](api/README.md#nonce)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="deleteSubscriberByToken"></a>
# **deleteSubscriberByToken**
> Boolean deleteSubscriberByToken(token)

Deletes an subscriber by token

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **token** | **String**|  | [default to null]

### Return type

[**Boolean**](api/Models/boolean.md)

### Authorization

[cookie](api/README.md#cookie), [nonce](api/README.md#nonce)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="findSubscriberByToken"></a>
# **findSubscriberByToken**
> subscriber findSubscriberByToken(token)

Find a subscriber by token

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **token** | **String**|  | [default to null]

### Return type

[**subscriber**](api/Models/subscriber.md)

### Authorization

[cookie](api/README.md#cookie), [nonce](api/README.md#nonce)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getAllSubscriber"></a>
# **getAllSubscriber**
> List getAllSubscriber()

Get all subscriber

### Parameters
This endpoint does not need any parameter.

### Return type

[**List**](api/Models/subscriber.md)

### Authorization

[cookie](api/README.md#cookie), [nonce](api/README.md#nonce)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="setNewSubscriberAdmin"></a>
# **setNewSubscriberAdmin**
> BigDecimal setNewSubscriberAdmin(Subscriber)

Add new subscriber

    For admin only: add a new subscriber

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Subscriber** | [**Subscriber**](api/Models/Subscriber.md)| Subscriber object | [optional]

### Return type

[**BigDecimal**](api/Models/number.md)

### Authorization

[cookie](api/README.md#cookie), [nonce](api/README.md#nonce)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="setNewSubscriberOpen"></a>
# **setNewSubscriberOpen**
> BigDecimal setNewSubscriberOpen(Subscriber)

Add new subscriber

    A user can add a subscription

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Subscriber** | [**Subscriber**](api/Models/Subscriber.md)| Subscriber object | [optional]

### Return type

[**BigDecimal**](api/Models/number.md)

### Authorization

[cookie](api/README.md#cookie), [nonce](api/README.md#nonce)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="updateSubscriberById"></a>
# **updateSubscriberById**
> Boolean updateSubscriberById(id, Subscriber)

Updates an existing subscriber

    Admin can update his subscription settings

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Long**|  | [default to null]
 **Subscriber** | [**Subscriber**](api/Models/Subscriber.md)| Subscriber object | [optional]

### Return type

[**Boolean**](api/Models/boolean.md)

### Authorization

[cookie](api/README.md#cookie), [nonce](api/README.md#nonce)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="updateSubscriberByToken"></a>
# **updateSubscriberByToken**
> Boolean updateSubscriberByToken(token, Subscriber)

Updates an existing subscriber

    A user can update his subscription settings

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **token** | **String**|  | [default to null]
 **Subscriber** | [**Subscriber**](api/Models/Subscriber.md)| Subscriber object | [optional]

### Return type

[**Boolean**](api/Models/boolean.md)

### Authorization

[cookie](api/README.md#cookie), [nonce](api/README.md#nonce)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

