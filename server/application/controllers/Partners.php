<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Partners extends CI_Controller
{

    public function index()
    {
        exit('partners');
    }

    public function getpartner()
    {
        $this->load->database();
        $this->load->model('partner_model');

        $restaurantId = $this->input->get('restaurant');

        $rows = $this->partner_model->getPartner($restaurantId);

        $result = array();
        if (sizeof($rows)) {
            $row = $rows[0];
            $image1 = 'uploads/partners/' . $row->restaurant_id . '_1.jpg';
            $image2 = 'uploads/partners/' . $row->restaurant_id . '_2.jpg';
            $image3 = 'uploads/partners/' . $row->restaurant_id . '_3.jpg';
            $row->image1 = file_exists($image1) ? base_url() . $image1 : './assets/images/no.jpg';
            $row->image2 = file_exists($image2) ? base_url() . $image2 : './assets/images/no.jpg';
            $row->image3 = file_exists($image3) ? base_url() . $image3 : './assets/images/no.jpg';
            $result = $row;
        }
        echo json_encode($result);
        exit;
    }

    public function savepartner()
    {
        $this->load->database();
        $this->load->model('partner_model');
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->partner_model->savePartner($data);
        exit;
    }

    public function deletepartner()
    {
        $data = $this->input->get();

        $this->load->database();
        $this->load->model('partner_model');
        $result = $this->partner_model->deletePartner($data['id']);
        exit;
    }
}
