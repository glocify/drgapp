<?php


class Restaurant_model extends CI_Model
{

    private $table = 'restaurants';

    function __construct()
    {
        /* Call the Model constructor */
        parent::__construct();
    }

    public function getRestaurant($restaurantId)
    {
        return $this->db->get_where($this->table, array('id' => $restaurantId))->first_row();
    }

    public function getRestaurants($categoryId)
    {
        return $this->db->get_where($this->table, array('category_id' => $categoryId))->result();
    }

    public function getRestaurantSearch($categoryId, $keyword, $lat, $lng)
    {
    
        $keyword = str_replace("'", "", $keyword);
        $keyword = str_replace(" ", "^", $keyword);
        $keyword = str_replace(".", "^", $keyword);
        $keyword = str_replace(",", "^", $keyword);
        $keywords = explode("^", $keyword);

        $where = '';
        if (sizeof($keywords)) {
            foreach ($keywords as $key => $keyword) {
                if ($keyword == '') continue;
                $where .= $where == '' ? '(' : ' AND ';
                $where .= 'REPLACE(CONCAT_WS(" ", A.address, A.city, B.restaurant_name, B.write_up), "\'", "") LIKE "%' . $keyword . '%"';
            }
            if ($where != '') $where .= ') AND ';
        }

        if ($categoryId == '') {
            $CI =& get_instance();
            $CI->load->model('category_model');
            $categories = $CI->category_model->getCategories();
            $categoryIds = array();
            if (sizeof($categories)) {
                foreach ($categories as $category) {
                    $categoryIds[] = $category->id;
                }
                $where .= '(B.category_id IN (' . implode(",", $categoryIds) . '))';
            }
        } else {
           $where .= '(B.category_id = ' . $categoryId . ')';
        }

        $query = '
            SELECT B.id AS restaurant_id, B.restaurant_name, B.category_id, C.comment AS category_link, 
                A.id, A.address, 
                (((acos(sin((' . $lat . ' * pi() / 180)) * sin((lat * pi() / 180)) + cos((' . $lat . ' * pi() / 180)) * cos((lat * pi() / 180)) * cos(((' . $lng . ' - lng) * pi() / 180)))) * 180 / pi()) * 60 * 1.1515) AS distance

            FROM addresses AS A 
            LEFT OUTER JOIN restaurants AS B ON A.restaurant_id=B.id 
            LEFT OUTER JOIN categories AS C ON B.category_id=C.id 
            WHERE ' . $where . '
            ORDER BY distance 
            LIMIT 0, 42 
        '; //echo $query;exit;
        $result = $this->db->query($query);
        return $result->result_array($result);
    }
    
    public function saveRestaurant($data)
    {

        $rowId = $data['id'];

        $cols = array('category_id', 'restaurant_name', 'write_up', 'delivery_website', 'menu_website', 'rest_type');
        $row = array();
        foreach ($cols as $col) {
            $row[$col] = isset($data[$col]) ? $data[$col] : '';
        }

        if ($rowId) {
            $this->db->where('id', $rowId);
            $result = $this->db->update($this->table, $row);
        } else {
            $result = $this->db->insert($this->table, $row);
            $rowId = $this->db->insert_id();

            $CI =& get_instance();
            $CI->load->model('address_model');
            $CI->address_model->saveAddress(array(
                    'id' => NULL,
                    'restaurant_id' => $rowId,
                    'address' => $row['restaurant_name'] . '(temp)')
            );
        }

        if (isset($data['image'])) {
            if (strpos($data['image'], 'base64')) {
                list(, $img) = explode(',', $data['image']);
                file_put_contents('uploads/restaurants/' . $rowId . '.jpg', base64_decode($img));
            }
        }

        if (isset($data['o_image'])) {
            if (strpos($data['o_image'], 'base64')) {
                list(, $img) = explode(',', $data['o_image']);
                file_put_contents('uploads/outside_images/' . $rowId . '.jpg', base64_decode($img));
            }
        }

        if (isset($data['menu_image'])) {
            if (strpos($data['menu_image'], 'base64')) {
                list(, $img) = explode(',', $data['menu_image']);
                file_put_contents('uploads/menu_images/' . $rowId . '.jpg', base64_decode($img));
            }
        }

        if (isset($data['coupon_image'])) {
            if (strpos($data['coupon_image'], 'base64')) {
                list(, $img) = explode(',', $data['coupon_image']);
                file_put_contents('uploads/coupon_images/' . $rowId . '.jpg', base64_decode($img));
            }
        }

        return $result;
    }

    public function deleteRestaurant($rowId)
    {
        $restaurantsRowsNum = $this->db->get_where('addresses', array('restaurant_id' => $rowId))->num_rows();
        if ($restaurantsRowsNum) {
            exit(json_encode(array('code' => 'addr', 'num' => $restaurantsRowsNum)));
        } else {
            $adsRowsNum = $this->db->get_where('advertisements', array('restaurant_id' => $rowId))->num_rows();
            if ($adsRowsNum) {
                exit(json_encode(array('code' => 'ads', 'num' => $adsRowsNum)));
            } else {
                unlink('uploads/restaurants/' . $rowId . '.jpg');
                unlink('uploads/outside_images/' . $rowId . '.jpg');
                return $this->db->delete($this->table, array('id' => $rowId));
            }
        }
    }
}