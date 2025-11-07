function setConfig() {
  const props = PropertiesService.getScriptProperties();
  props.setProperties({
    SHEET_ID_OLD: '1XpM0wlkbnpaSAVLuwXZfv_BHAVcZ0AOgr_xudCLt-ug', 
    SHEET_ID_NEW: '1t_dFtkP5DI4C-B9SF7_b9bTED6bvdRS4EHDGdv93baI', 
    TAB_OLD: 'Full Dataset',
    TAB_NEW: 'Approval',
    FLASK_BASE_URL: 'http://localhost:5001/api' 
  }, true);
}  

function showConfig() {
  const props = PropertiesService.getScriptProperties().getProperties();
  Logger.log(props);
}
