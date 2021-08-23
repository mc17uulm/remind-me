<?php

namespace RemindMe;

/**
 *
 */
final class ReactContainer
{

    /**
     * @param string $key
     * @return callable
     */
    public static function render(string $key = 'remind-me-container') : callable {
        return function() use($key) {
            ?>
            <div id='<?php echo $key ?>'>
                <h3><?php echo __('If you see this message more than a few seconds, please report an error', 'remind-me') ?></h3>
            </div>
            <?php
        };
    }

}