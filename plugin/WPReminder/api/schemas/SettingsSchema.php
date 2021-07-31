<?php

namespace WPReminder\api\schemas;

use WPReminder\api\JsonSchema;
use WPReminder\api\objects\Settings;
use WPReminder\api\objects\settings\License;
use WPReminder\api\objects\settings\Messages;
use WPReminder\api\objects\settings\Templates;
use WPReminder\api\ValidationException;

/**
 * Class SettingsSchema
 * @package WPReminder\api\schemas
 */
final class SettingsSchema extends JsonSchema
{

    /**
     * SettingsSchema constructor.
     * @throws ValidationException
     */
    public function __construct()
    {
        parent::__construct("settings.schema.json");
    }

    /**
     * @return Settings
     */
    public function cast() : Settings
    {
        return new Settings(
            new Messages($this->result['messages']),
            new License($this->result['license']),
            $this->result['settings_page'],
            $this->result['privacy_text']
        );
    }

}