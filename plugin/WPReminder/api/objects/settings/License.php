<?php

namespace WPReminder\api\objects\settings;

/**
 * Class License
 * @package WPReminder\api\objects\settings
 */
final class License
{

    /**
     * @var string
     */
    public string $code;
    /**
     * @var bool
     */
    public bool $active;
    /**
     * @var int
     */
    public int $til;
    /**
     * @var string
     */
    public string $status;

    /**
     * License constructor.
     * @param array $options
     */
    public function __construct(array $options)
    {
        $this->code = $options['code'];
        if(!isset($options['status'])) {
            //TODO: check code for license
            $this->active = false;
            $this->til = -1;
            $this->status = 'not activated';
        } else {
            $this->active = $options['active'];
            $this->til = $options['til'];
            $this->status = $options['status'];
        }
    }

    /**
     * @return array
     */
    public function to_json() : array {
        return [
            'code' => $this->code,
            'active' => $this->active,
            'til' => $this->til,
            'status' => $this->status
        ];
    }

    /**
     * @return License
     */
    public static function create_default() : License {
        return new License([
            'code' => '',
            'active' => false,
            'til' => -1,
            'status' => 'not registered'
        ]);
    }

}