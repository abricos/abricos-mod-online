<?php
/**
 * @version $Id$
 * @package Abricos
 * @subpackage Online
 * @copyright Copyright (C) 2008 Abricos. All rights reserved.
 * @license http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
 * @author Alexander Kuzmin (roosit@abricos.org)
 */

require_once 'dbquery.php';

class OnlineManager extends Ab_ModuleManager {
	
	/**
	 * 
	 * @var OnlineModule
	 */
	public $module = null;
	
	private $_disableRoles = false;
	
	public function __construct(OnlineModule $module){
		parent::__construct($module);
	}
	
	public function DisableRole(){
		$this->_disableRoles = true; 
	}
	
	public function IsAdminRole(){
		return $this->IsRoleEnable(OnlineAction::ADMIN);
	}
	
	public function IsWriteRole(){
		return $this->IsRoleEnable(OnlineAction::WRITE);
	}
	
	public function DSProcess($name, $rows){
		$p = $rows->p;
		$db = $this->db;
		
		switch ($name){
			case 'onlinelist':
				/*
				foreach ($rows->r as $r){
					if ($r->f == 'u'){ $this->ProductUpdate($r->d); }
				}
				/**/
				return;
		}
	}
	
	public function DSGetData($name, $rows){
		$p = $rows->p;
		switch ($name){
			case 'onlinelist': return $this->OnlineList();
		}
	}
	
	public function AJAX($d){
		switch($d->do){
			case "onlinesave": return $this->OnlineSave($d->online);
		}
		return null;
	}
	
}

?>