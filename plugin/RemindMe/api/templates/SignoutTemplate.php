<?php

namespace RemindMe\api\templates;

use RemindMe\api\objects\Subscriber;

/**
 * Class SignoutTemplate
 * @package RemindMe\api\templates
 */
final class SignoutTemplate extends Template
{

    /**
     * SignoutTemplate constructor.
     * @param string $html
     * @param string $subject
     */
    public function __construct(string $html, string $subject)
    {
        parent::__construct($html, $subject);
    }

    /**
     * @param Subscriber $subscriber
     * @return string
     */
    public function render(Subscriber $subscriber): string
    {
        return $this->html;
    }

    /**
     * @param callable|null $build
     * @return string
     */
    public static function create(callable $build = null): string
    {
        return parent::create(function() {
            ?>
            <h1 class="ql-align-center"><?php echo __('Company name', 'remind-me') ?></h1>
            <p class="ql-align-center"><br></p>
            <p class="ql-align-center"><?php echo __('You successfull unsubscribed from our services', 'remind-me') ?></p>
            <p class="ql-align-center"><br></p>
            <p class="ql-align-center">--</p>
            <p class="ql-align-center"><?php echo __('Company name | Street 1 | 12345 City', 'remind-me') ?></p>
            <?php
        });
    }

}