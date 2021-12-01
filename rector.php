<?php

declare(strict_types=1);

use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Rector\Set\ValueObject\DowngradeSetList;
use Rector\Core\Configuration\Option;

return static function (ContainerConfigurator $configurator) : void {

    $parameters = $configurator->parameters();

    $parameters->set(Option::PATHS, [__DIR__ . '/remind-me.php', __DIR__ . '/plugin/RemindMe']);

    $configurator->import(DowngradeSetList::PHP_80);
    $configurator->import(DowngradeSetList::PHP_74);
    $configurator->import(DowngradeSetList::PHP_73);
    $configurator->import(DowngradeSetList::PHP_72);
    $configurator->import(DowngradeSetList::PHP_71);

};