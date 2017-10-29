<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Categories extends CI_Controller {

	public function index()
	{
		exit('categories');
	}
	public function getcategories()
	{
		$this->load->database();
		$this->load->model('category_model');
        $rows = $this->category_model->getCategories();

        $result = array();
        if (sizeof($rows)) {
        	foreach ($rows as $key => $value) {
        		$image = 'uploads/categories/' . $value->id . '.jpg';
        		$value->image = file_exists($image) ? base_url() . $image : './assets/images/no.jpg';
        		
        		$ads_image = 'uploads/category_ads/' . $value->id . '.jpg';	// fixed ads image.
        		$value->ads_image = file_exists($ads_image) ? base_url() . $ads_image : './assets/images/no.jpg';
        		
        		$ads_image1 = 'uploads/category_ads/' . $value->id . '_1.jpg';
        		$value->ads_image1 = file_exists($ads_image1) ? base_url() . $ads_image1 : './assets/images/no.jpg';
        		
        		$ads_image2 = 'uploads/category_ads/' . $value->id . '_2.jpg';
        		$value->ads_image2 = file_exists($ads_image2) ? base_url() . $ads_image2 : './assets/images/no.jpg';
        		
        		$ads_image3 = 'uploads/category_ads/' . $value->id . '_3.jpg';
        		$value->ads_image3 = file_exists($ads_image3) ? base_url() . $ads_image3 : './assets/images/no.jpg';
        		
        		$result[$value->id] = $value;
        	}
        }
		echo json_encode($result);
		exit;
	}

	public function savecategory()
	{
		$this->load->database();
		$this->load->model('category_model');
		$data = json_decode(file_get_contents('php://input'),true);
		$result = $this->category_model->saveCategory($data);
		exit;
	}

	public function deletecategory()
	{
		$data = $this->input->get();

		$this->load->database();
		$this->load->model('category_model');
		$result = $this->category_model->deleteCategory($data['id']);
		exit;
	}

}
