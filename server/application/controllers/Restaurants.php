<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Restaurants extends CI_Controller
{

    public function index()
    {
        exit('restaurants');
    }

    public function getrestaurants()
    {
        $this->load->database();
        $this->load->model('restaurant_model');

        $categoryId = $this->input->get('category');
        $keyword = $this->input->get('q');
	
        $rows = $this->restaurant_model->getRestaurants($categoryId, $keyword);
	
        $result = array();
        if (sizeof($rows)) {
            foreach ($rows as $key => $value) {
                $value->image = $this->getImagePath($value->id, 'restaurants');
                $value->o_image = $this->getImagePath($value->id, 'outside_images');
                $value->menu_image = $this->getImagePath($value->id, 'menu_images');
                $value->coupon_image = $this->getImagePath($value->id, 'coupon_images');
                $result[$value->id] = $value;
            }
        }
        echo json_encode($result);
        exit;
    }

    public function searchrestaurants()
    {
        $this->load->database();
        $this->load->model('restaurant_model');

        $categoryId = $this->input->get('category');
        $keyword = $this->input->get('q');
        $lat = $this->input->get('lat');
        $lng = $this->input->get('lng');
		
		$groupon_deal = "";
		$groupon_img_arr = array(
				'Groupon-Ad-01.png',
				'Groupon-Ad-02.png',
				'Groupon-AmericanFood-Ad-01.png',
				'Groupon-Asian-Food-Ad-01.png',
				'Groupon-Asian-Food-Ad-1007.png',
				'Groupon-European-Food-Ad-1306-2.png',
				'Groupon-European-Food-Ad-1306-3.png',
				'Groupon-European-Food-Ad-1307.png',
				'Groupon-Latin-Food-Ad-1307.png',
				'Groupon-MainCategory-Food-Ad-1307.png',
				'Groupon-Mediterrean-Food-Ad-1307.png',
				'Groupon-Other-Food-Ad-1307.png'
			);
		$random_keys = array_rand($groupon_img_arr);
		$groupon_dealUrl = "https://www.groupon.com";
		$url = 'https://partner-api.groupon.com/deals.json?tsToken=US_AFF_0_206745_0&lat='.$lat.'&lng='.$lng.'&offset=0&limit=1&channel_id=local&filters=category:food-and-drink';
		$response = file_get_contents($url);
		$response = json_decode($response);
		foreach($response as $deals){
			foreach($deals as $deal){
				if(isset($deal->largeImageUrl)){
					//$groupon_deal = $deal->largeImageUrl;
					$groupon_dealUrl = $deal->dealUrl;
				}		
			}	
		}
		
		$groupon_deal = base_url() . 'uploads/groupon-ads/'.$groupon_img_arr[$random_keys];
		
        $rows = $this->restaurant_model->getRestaurantSearch($categoryId, $keyword, $lat, $lng);
		//print_r($rows);
        $result = array();
        if (sizeof($rows)) {
            foreach ($rows as $key => $value) {
				//if ($value['distance'] > 5) continue;
                $value['image'] = $this->getImagePath($value['restaurant_id'], 'restaurants');
                $value['menu_image'] = $this->getImagePath($value['restaurant_id'], 'menu_images');
                $value['coupon_image'] = $this->getImagePath($value['restaurant_id'], 'coupon_images');
                $value['cate_ads'] = $this->getImagePath($value['category_id'], 'category_ads');
                $value['cate_ads1'] = $this->getImagePath($value['category_id'] . '_1', 'category_ads');
                $value['cate_ads2'] = $this->getImagePath($value['category_id'] . '_2', 'category_ads');
                $value['cate_ads3'] = $this->getImagePath($value['category_id'] . '_3', 'category_ads');
                $value['groupon_deal'] = $groupon_deal;
                $value['groupon_dealUrl'] = $groupon_dealUrl;
                $result[$key] = $value;
            }
        }
		//print_r($result);
        echo json_encode($result);
        exit;
    }

    public function getrestaurantdetail()
    {
        $this->load->database();
        $this->load->model('address_model');
        $this->load->model('ads_model');

        $addressId = $this->input->get('address');

        $result = $this->address_model->getRestaurantDetail($addressId);

        $rows = $this->ads_model->getAds($result->restaurant_id);

        $ads = array();
        if (sizeof($rows)) {
            foreach ($rows as $key => $value) {
                $value->image = $this->getImagePath($value->id, 'ads');
                $ads[$value->id] = $value;
            }
        }

        $result->ads = $ads;

        $result->main_image = $this->getImagePath($result->restaurant_id, 'outside_images');
        $result->logo_image = $this->getImagePath($result->restaurant_id, 'restaurants');
        $result->menu_image = $this->getImagePath($result->restaurant_id, 'menu_images', 'no-menu.jpg');
        $result->coupon_image = $this->getImagePath($result->restaurant_id, 'coupon_images', 'no-coupon.jpg');
        
        $this->load->model('partner_model');
        $result->partner_link1 = '';
        $result->partner_link2 = '';
        $result->partner_link3 = '';
        $partnerRows = $this->partner_model->getPartner($result->restaurant_id);
        if (sizeof($partnerRows)) {
            $result->partner_link1 = $partnerRows[0]->link1;
            $result->partner_link2 = $partnerRows[0]->link2;
            $result->partner_link3 = $partnerRows[0]->link3;
        }
        $result->partner_image1 = $this->getImagePath($result->restaurant_id . '_1', 'partners', 'no.jpg');
        $result->partner_image2 = $this->getImagePath($result->restaurant_id . '_2', 'partners', 'no.jpg');
        $result->partner_image3 = $this->getImagePath($result->restaurant_id . '_3', 'partners', 'no.jpg');
        $result->menu_website = $result->menu_website == '' ? 'http://digimenuapp.com' : $result->menu_website;
        echo json_encode($result);
        exit;
    }

    public function saverestaurant()
    {
        $this->load->database();
        $this->load->model('restaurant_model');
        $data = json_decode(file_get_contents('php://input'), true);
        $this->restaurant_model->saveRestaurant($data);
        exit;
    }

    public function deleterestaurant()
    {
        $data = $this->input->get();

        $this->load->database();
        $this->load->model('restaurant_model');
        $this->restaurant_model->deleteRestaurant($data['id']);
        exit;
    }

    public function search()
    {
        $this->load->database();
        $this->load->model('restaurant_model');

        $keyword = $this->input->get('keyword');
        $categoryId = $this->input->get('category');

        $rows = $this->restaurant_model->searchRestaurants($categoryId, $keyword);

        $result = array();
        if (sizeof($rows)) {
            foreach ($rows as $key => $value) {
                $value->image = $this->getImagePath($value->id, 'restaurants');
                $result[$value->id] = $value;
            }
        }
        echo json_encode($result);
        exit;
    }

    private function getImagePath($id, $folder, $noImage = 'no.jpg')
    {
        $image = 'uploads/' . $folder . '/' . $id . '.jpg';
        return file_exists($image) ? base_url() . $image . '?v=' . time() : './assets/images/' . $noImage;
    }
}
