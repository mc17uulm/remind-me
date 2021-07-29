# SettingsApi

All URIs are relative to *http://}*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getSettings**](SettingsApi.md#getSettings) | **GET** /settings | Get settings
[**updateSettings**](SettingsApi.md#updateSettings) | **PUT** /settings | Update settings


<a name="getSettings"></a>
# **getSettings**
> settings getSettings()

Get settings

### Parameters
This endpoint does not need any parameter.

### Return type

[**settings**](../Models/settings.md)

### Authorization

[cookie](../README.md#cookie), [nonce](../README.md#nonce)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="updateSettings"></a>
# **updateSettings**
> Boolean updateSettings(Settings)

Update settings

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Settings** | [**Settings**](../Models/Settings.md)| Settings object | [optional]

### Return type

[**Boolean**](../Models/boolean.md)

### Authorization

[cookie](../README.md#cookie), [nonce](../README.md#nonce)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

