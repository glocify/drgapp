<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Addresses extends CI_Controller {

	public function index()
	{
		exit('restaurants');
	}

	public function getaddresses()
	{
		$this->load->database();
		$this->load->model('address_model');

		$restaurantId = $this->input->get('restaurant');

        $rows = $this->address_model->getAddresses($restaurantId);

        $result = array();
        if (sizeof($rows)) {
        	foreach ($rows as $key => $value) {
        		$result[$value->id] = $value;
        	}
        }
		echo json_encode($result);
		exit;
	}

	public function saveaddress()
	{
		$this->load->database();
		$this->load->model('address_model');
		$data = json_decode(file_get_contents('php://input'),true);
	        $this->address_model->saveAddress($data);
		exit;
	}

	public function deleteaddress()
	{
		$data = $this->input->get();

		$this->load->database();
		$this->load->model('address_model');
		$this->address_model->deleteAddress($data['id']);
		exit;
	}
}
