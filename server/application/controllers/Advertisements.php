<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Advertisements extends CI_Controller {

	public function index()
	{
		exit('restaurants');
	}

	public function getads()
	{
		$this->load->database();
		$this->load->model('ads_model');

		$restaurantId = $this->input->get('restaurant');

        $rows = $this->ads_model->getAds($restaurantId);

        $result = array();
        if (sizeof($rows)) {
        	foreach ($rows as $key => $value) {
        		$image = 'uploads/ads/' . $value->id . '.jpg';
        		$value->image = file_exists($image) ? base_url() . $image : './assets/images/no.jpg';
        		$result[$value->id] = $value;
        	}
        }
		echo json_encode($result);
		exit;
	}

	public function saveads()
	{
		$this->load->database();
		$this->load->model('ads_model');
		$data = json_decode(file_get_contents('php://input'),true);
        $result = $this->ads_model->saveAds($data);
		exit;
	}

	public function deleteads()
	{
		$data = $this->input->get();

		$this->load->database();
		$this->load->model('ads_model');
		$result = $this->ads_model->deleteAds($data['id']);
		exit;
	}
}
