<?php

namespace WPReminder\api\schemas;

use WPReminder\api\JsonSchema;
use WPReminder\api\ValidationException;

/**
 * Class EventSchema
 * @package WPReminder\api\schemas
 */
final class EventSchema extends JsonSchema
{

    /**
     * EventSchema constructor.
     * @throws ValidationException
     */
    public function __construct()
    {
        parent::__construct("event.schema.json");
    }

}