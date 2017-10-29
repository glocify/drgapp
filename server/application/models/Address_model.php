<?php


class Address_model extends CI_Model
{

    private $table = 'addresses';

    function __construct()
    {
        /* Call the Model constructor */
        parent::__construct();
    }

    public function getAddresses($restaurantId)
    {
        return $this->db->get_where($this->table, array('restaurant_id' => $restaurantId))->result();
    }

    public function getRestaurantDetail($addressId)
    {
        $query = '
            SELECT A.*, B.write_up, B.category_id, B.delivery_website, B.menu_website, B.rest_type    
            FROM '.$this->table.' AS A 
            LEFT OUTER JOIN restaurants AS B ON A.restaurant_id=B.id 
            WHERE A.id="'.$addressId.'"
        ';
        $result = $this->db->query($query);
        return $result->row();
    }

    public function saveAddress($data)
    {

        $rowId = $data['id'];

        $cols = array('restaurant_id', 'sign', 'address', 'city', 'state', 'zip_code', 'phone', 'time_val', 'cost', 'lat', 'lng');
        $row = array();
        foreach ($cols as $col) {
            $row[$col] = isset($data[$col]) ? $data[$col] : '';
        }

        if ($rowId) {
            $this->db->where('id', $rowId);
            $result = $this->db->update($this->table, $row);
        } else {
            $result = $this->db->insert($this->table, $row);
            $this->db->insert_id();
        }


        return $result;
    }

    public function deleteAddress($rowId)
    {
        return $this->db->delete($this->table, array('id' => $rowId));
    }
}