<?php


class Ads_model extends CI_Model {

    private $table = 'advertisements';

    function __construct() 
    {
        /* Call the Model constructor */
        parent::__construct();
    }

    public function getAds($restaurantId)
    {
        return $this->db->get_where($this->table, array('restaurant_id' => $restaurantId))->result();
    }

    public function saveAds($data)
    {

        $rowId = $data['id'];

        $cols = array('ads_name', 'restaurant_id');
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
        }
        
        if (isset($data['image'])) {
            if (strpos($data['image'], 'base64')) {
                list(, $img) = explode(',', $data['image']);
                file_put_contents('uploads/ads/' . $rowId .'.jpg', base64_decode($img));
            }
        }

        return $result;
    }

    public function deleteAds($rowId)
    {
        unlink('uploads/ads/' . $rowId .'.jpg');
        return $this->db->delete($this->table, array('id' => $rowId));
    }
}