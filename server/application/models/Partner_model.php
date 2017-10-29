<?php


class Partner_model extends CI_Model {

    private $table = 'partners';

    function __construct() 
    {
        /* Call the Model constructor */
        parent::__construct();
    }

    public function getPartner($restaurantId)
    {
        return $this->db->get_where($this->table, array('restaurant_id' => $restaurantId))->result();
    }

    public function savePartner($data)
    {

        $rowId = $data['id'];

        $cols = array('link1', 'link2', 'link3', 'restaurant_id');
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
        
        if (isset($data['image1'])) {
            if (strpos($data['image1'], 'base64')) {
                list(, $img) = explode(',', $data['image1']);
                file_put_contents('uploads/partners/' . $row['restaurant_id'] .'_1.jpg', base64_decode($img));
            }
        }
        if (isset($data['image2'])) {
            if (strpos($data['image2'], 'base64')) {
                list(, $img) = explode(',', $data['image2']);
                file_put_contents('uploads/partners/' . $row['restaurant_id'] .'_2.jpg', base64_decode($img));
            }
        }
        if (isset($data['image3'])) {
            if (strpos($data['image3'], 'base64')) {
                list(, $img) = explode(',', $data['image3']);
                file_put_contents('uploads/partners/' . $row['restaurant_id'] .'_3.jpg', base64_decode($img));
            }
        }

        return $result;
    }

    public function deletePartner($rowId)
    {
        unlink('uploads/partners/' . $rowId .'_1.jpg');
        unlink('uploads/partners/' . $rowId .'_2.jpg');
        unlink('uploads/partners/' . $rowId .'_3.jpg');
        return $this->db->delete($this->table, array('id' => $rowId));
    }
}