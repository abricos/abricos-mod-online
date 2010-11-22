<?php
/**
 * Схема таблиц данного модуля.
 * 
 * @version $Id$
 * @package Abricos
 * @subpackage Online
 * @copyright Copyright (C) 2008 Abricos. All rights reserved.
 * @license http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
 * @author 
 */

$charset = "CHARACTER SET 'utf8' COLLATE 'utf8_general_ci'";
$updateManager = CMSRegistry::$instance->modules->updateManager; 
$db = CMSRegistry::$instance->db;
$pfx = $db->prefix;

if ($updateManager->isInstall()){

	CMSRegistry::$instance->modules->GetModule('online')->permission->Install();

}

?>