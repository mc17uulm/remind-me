<?php

namespace RemindMe\api\schemas;

use RemindMe\api\JsonSchema;
use RemindMe\api\objects\Settings;
use RemindMe\api\objects\settings\License;
use RemindMe\api\objects\settings\Messages;
use RemindMe\api\objects\settings\Templates;
use RemindMe\api\ValidationException;

/**
 * Class SettingsSchema
 * @package RemindMe\api\schemas
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
     * @throws ValidationException
     */
    public function cast() : Settings
    {
        if($this->result === null) throw new ValidationException('JsonSchema returned null result');
        return new Settings(
            new Messages($this->result['messages']),
            new License($this->result['license']),
            $this->result['privacy_text']
        );
    }

}