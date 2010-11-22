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

class OnlineManager extends ModuleManager {
	
	/**
	 * 
	 * @var OnlineModule
	 */
	public $module = null;
	
	/**
	 * User
	 * @var User
	 */
	public $user = null;
	public $userid = 0;
	
	private $_disableRoles = false;
	
	public function OnlineManager(OnlineModule $module){
		parent::ModuleManager($module);
		
		$this->user = CMSRegistry::$instance->modules->GetModule('user');
		$this->userid = $this->user->info['userid'];
	}
	
	public function DisableRole(){
		$this->_disableRoles = true; 
	}
	
	public function IsAdminRole(){
		return $this->module->permission->CheckAction(OnlineAction::ADMIN) > 0;
	}
	
	public function IsWriteRole(){
		return $this->module->permission->CheckAction(OnlineAction::WRITE) > 0;
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