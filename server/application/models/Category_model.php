<?php


class Category_model extends CI_Model {

    private $table = 'categories';

    function __construct() 
    {
        /* Call the Model constructor */
        parent::__construct();
    }

    public function getCategories()
    {
        $query = $this->db->get($this->table);
        return $query->result();
    }

    public function saveCategory($data)
    {

        $rowId = $data['id'];

        if ($rowId) {
            $this->db->where('id', $rowId);
            $result = $this->db->update($this->table, array(
                'title'=> isset($data['title']) ? $data['title'] : '',
                'comment'=>isset($data['comment']) ? $data['comment'] : ''
            ));
        } else {
            $result = $this->db->insert($this->table, array(
                'title'=>isset($data['title']) ? $data['title'] : '',
                'comment'=>isset($data['comment']) ? $data['comment'] : ''
            ));
            $rowId = $this->db->insert_id();
        }
        
        if (isset($data['image'])) {
            if (strpos($data['image'], 'base64')) {
                list(, $img) = explode(',', $data['image']);
                file_put_contents('uploads/categories/' . $rowId .'.jpg', base64_decode($img));
            }
        }
        
        if (isset($data['ads_image'])) {
            if (strpos($data['ads_image'], 'base64')) {
                list(, $img) = explode(',', $data['ads_image']);
                file_put_contents('uploads/category_ads/' . $rowId .'.jpg', base64_decode($img));
            }
        }
        
        if (isset($data['ads_image1'])) {
            if (strpos($data['ads_image1'], 'base64')) {
                list(, $img) = explode(',', $data['ads_image1']);
                file_put_contents('uploads/category_ads/' . $rowId .'_1.jpg', base64_decode($img));
            }
        }
        
        if (isset($data['ads_image2'])) {
            if (strpos($data['ads_image2'], 'base64')) {
                list(, $img) = explode(',', $data['ads_image2']);
                file_put_contents('uploads/category_ads/' . $rowId .'_2.jpg', base64_decode($img));
            }
        }
        
        if (isset($data['ads_image3'])) {
            if (strpos($data['ads_image3'], 'base64')) {
                list(, $img) = explode(',', $data['ads_image3']);
                file_put_contents('uploads/category_ads/' . $rowId .'_3.jpg', base64_decode($img));
            }
        }

        return $result;
    }

    public function deleteCategory($rowId)
    {
        unlink('uploads/categories/' . $rowId .'.jpg');
        unlink('uploads/category_ads/' . $rowId .'.jpg');
        unlink('uploads/category_ads/' . $rowId .'_1.jpg');
        unlink('uploads/category_ads/' . $rowId .'_2.jpg');
        unlink('uploads/category_ads/' . $rowId .'_3.jpg');
        return $this->db->delete($this->table, array('id' => $rowId));
    }
}