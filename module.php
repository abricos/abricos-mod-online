<?php
/**
 * @version $Id$
 * @package Abricos
 * @subpackage Online
 * @copyright Copyright (C) 2008 Abricos. All rights reserved.
 * @license http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
 * @author Alexander Kuzmin (roosit@abricos.org)
 */

class OnlineModule extends Ab_Module {
	
	private $_manager;
	
	function __construct(){
		$this->version = "0.1.1";
		$this->name = "online";
		
		$this->permission = new OnlinePermission($this);
	}
	
	/**
	 * Получить менеджер
	 *
	 * @return OnlineManager
	 */
	public function GetManager(){
		if (is_null($this->_manager)){
			require_once 'includes/manager.php';
			$this->_manager = new OnlineManager($this);
		}
		return $this->_manager;
	}
}

class OnlineAction {
	const VIEW	= 10;
	const WRITE	= 30;
	const ADMIN	= 50;
}

class OnlinePermission extends CMSPermission {
	
	public function OnlinePermission(OnlineModule $module){
		$defRoles = array(
			new CMSRole(OnlineAction::VIEW, 1, User::UG_GUEST),
			new CMSRole(OnlineAction::VIEW, 1, User::UG_REGISTERED),
			new CMSRole(OnlineAction::VIEW, 1, User::UG_ADMIN),
			
			new CMSRole(OnlineAction::WRITE, 1, User::UG_REGISTERED),
			new CMSRole(OnlineAction::WRITE, 1, User::UG_ADMIN),
			
			new CMSRole(OnlineAction::ADMIN, 1, User::UG_ADMIN)
		);
		parent::CMSPermission($module, $defRoles);
	}
	
	public function GetRoles(){
		return array(
			OnlineAction::VIEW => $this->CheckAction(OnlineAction::VIEW),
			OnlineAction::WRITE => $this->CheckAction(OnlineAction::WRITE), 
			OnlineAction::ADMIN => $this->CheckAction(OnlineAction::ADMIN) 
		);
	}
}

Abricos::ModuleRegister(new OnlineModule());

?>