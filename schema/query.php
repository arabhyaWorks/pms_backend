public function getProjectList($where=null)
{
$this->db->select("SUM(bud.installment_amount) as total_installment_amount, SUM(bud.instalment_expenditure) as
total_instalment_expenditure,
exe.executing_agency_name,a.amount_released_from_shashan,a.date_for_project_stage_completion,a.cost_of_project_per_revised_acceptance,a.work_order_formation_date,a.date_of_land_handover_to_executing_agency,a.go_ref_no,a.project_category,a.project_id,
a.proj_ref_no, a.project_name, a.project_start_date, a.actual_end_date, a.date_of_providing_land_executing_agency,
a.estimate_date_completion_as_per_executing,a.work_order_issued_date,a.date_of_revised_approval,a.project_status ,
a.project_percent_complete, a.project_description, a.project_target_budget, a.project_actual_budget, a.project_priority,
a.project_type, a.goal_benefits, a.yojna_name, a.ministry_name, a.project_revised_budget,a.sanctioned_amount,
a.project_short_name, c.dept_name,c.original_dept_url,c.dept_id,a.project_released_budget,GROUP_CONCAT(pde.present_date
order by pde.id desc ) as present_date,GROUP_CONCAT( pde.extended_date order by pde.id desc ) as extended_date");
$this->db->from($this->projects .' as a');
$this->db->join($this->project_departments .' as b','a.project_id = b.project_id');
$this->db->join($this->departments .' as c','b.department_id = c.dept_id');
$this->db->join($this->projects_date_extend .' as pde','a.project_id = pde.project_id','left');
$this->db->join('dotp_executing_agency as exe','a.project_executing_agency = exe.id','left');
$this->db->join('dotp_project_budget_recieved_installment as bud','a.project_id = bud.project_id','left');
/*$this->db->join($this->project_gallery .' as pg','a.project_id = pg.project_id');*/
$this->db->where('a.status', 1);

if($where) {
$this->db->where($where);
}
//$this->db->where_in('a.project_status', array('3'));
$this->db->group_by('a.project_id');
$this->db->order_by('c.dept_name');

return $this->db->get()->result();


}