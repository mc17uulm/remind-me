<?php

namespace WPReminder\api\schemas;

use WPReminder\api\JsonSchema;
use WPReminder\api\objects\Settings;
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

    public function cast() : Settings
    {
        return new Settings(
            $this->result['text_privacy'],
            $this->result['template_check'],
            $this->result['template_accept'],
            $this->result['template_signout'],
            $this->result['signin_msg'],
            $this->result['double_opt_in_msg'],
            $this->result['signout_msg']
        );
    }

}