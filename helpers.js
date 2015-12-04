
// To remove entities global search
$(function () {
    var $header = $("#header");
    $header.find("#search").show();
    $header.find(".to-replace").entitysearch("destroy");
});


// To override entities global search filters
$(function () {
    var $header = $("#header");
    $header.find("to-replace").entitysearch("option", "popover", {
      ajax: {
        delay: 0,
        url: entities.api.search.endpoints.account,
        type: "POST",
        data: function (keyword) {
          return $.toJSON({
            searchType: entities.api.search.type.account,
            filters: [entities.api.search.filterBuilder.profile("", keyword, entities.api.search.filterBuilder.operator.like)/* Provide your additional filders here */],
            include: { skills: false, entities: [], facets: [] },
            sorting: { propertyName: entities.search.profile.formatProperty(entities.profile.properties.system.lastName), direction: entities.api.search.sortDirection.asc }
          });
        }
    });
});
