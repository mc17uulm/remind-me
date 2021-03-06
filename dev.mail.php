<?php

require_once ABSPATH . WPINC . '/PHPMailer/PHPMailer.php';
require_once ABSPATH . WPINC . '/PHPMailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;

/**
 *
 * Allow sending emails for development and testing on localhost
 *
 * @param PHPMailer $mailer
 * @return void
 */
function send_dev_mail(PHPMailer &$mailer) : void {

    /**
     * Get SMTP account for testing email delivery
     *
     * Requires array values given by 'dev.env.php.config'
     */
    $env = require_once __DIR__ . '/dev.env.php';

    $mailer->SMTPDebug = 0;
    $mailer->isSMTP();
    $mailer->SMTPAuth = true;
    $mailer->Username = $env['SMTP_USERNAME'];
    $mailer->Password = $env['SMTP_PASSWORD'];
    $mailer->Port = $env['SMTP_PORT'];
    $mailer->Host = $env['SMTP_HOST'];
    $mailer->FromName = get_bloginfo('name');
    $mailer->From = $env['SMTP_FROM'];
}