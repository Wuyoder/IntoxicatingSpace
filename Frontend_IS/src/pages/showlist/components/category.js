const Category = ({ category }) => {
  return (
    <div>
      <div class='show' id='show_hot'>
        <div class='show_list_top'>
          <div class='show_list_title'>{category}</div>
          <div class='show_more' Style='display:none'>
            more
          </div>
        </div>
        <div id='show_list_main1'></div>
      </div>
    </div>
  );
};
export default Category;
