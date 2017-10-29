<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Settings extends CI_Controller
{

    public function index()
    {
        exit('settings');
    }

    public function getmainads()
    {
        $staticImages = array();
        for ($i = 0; $i < 2; $i++) {
            $image = 'uploads/main_images/static_ads' . ($i + 1) . '.jpg';
            $path = file_exists($image) ? base_url() . $image : './assets/images/no.jpg';
            $staticImages[$i] = $path;
        }
        $dynamicImages = array();
        for ($i = 0; $i < 3; $i++) {
            $image = 'uploads/main_images/dynamic_ads' . ($i + 1) . '.jpg';
            $path = file_exists($image) ? base_url() . $image : './assets/images/no.jpg';
            $dynamicImages[$i] = $path;
        }
        $result = array('static'=> $staticImages, 'dynamic' => $dynamicImages);
        echo json_encode($result);
        exit;
    }

    public function savemainads()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        for ($i = 0; $i < 2; $i++) {
            if (isset($data['static'][$i])) {
                if (strpos($data['static'][$i], 'base64')) {
                    list(, $img) = explode(',', $data['static'][$i]);
                    file_put_contents('uploads/main_images/static_ads' . ($i + 1) . '.jpg', base64_decode($img));
                }
            }
        }

        for ($i = 0; $i < 3; $i++) {
            if (isset($data['dynamic'][$i])) {
                if (strpos($data['dynamic'][$i], 'base64')) {
                    list(, $img) = explode(',', $data['dynamic'][$i]);
                    file_put_contents('uploads/main_images/dynamic_ads' . ($i + 1) . '.jpg', base64_decode($img));
                }
            }
        }

        exit;
    }

}
