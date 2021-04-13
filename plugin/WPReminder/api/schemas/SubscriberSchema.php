<?php

namespace WPReminder\api\schemas;

use WPReminder\api\JsonSchema;
use WPReminder\api\ValidationException;

/**
 * Class SubscriberSchema
 * @package WPReminder\api\schemas
 */
final class SubscriberSchema extends JsonSchema
{

    /**
     * SubscriberSchema constructor.
     * @throws ValidationException
     */
    public function __construct()
    {
        parent::__construct("subscriber.schema.json");
    }

}