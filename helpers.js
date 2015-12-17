
// To remove entities global search
$(function () {
  if (!firmDirectory.configuration.standalone) {
    var $header = $("#header");
    $header.find(".to-replace").entitysearch("destroy");
    $header.find("#search").show();
  }
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

// To redirect People tab in default search to Entities People Search
$(function () {
  setInterval(function () {
    if (typeof searchTypeClick == "function") {
      searchTypeClick = function(typeId) {
        if ($('#t').val() != typeId) {
            $('#t').val(typeId);
            $('#p').hide().appendTo('#search-types');
            $('#search-advanced').remove();
            $('#order-by').remove();
            $('#order-is-descending').remove();
            typeId === "person" ? $(pex.events).trigger("default-search-change", [typeId]) : navigateSearch();
        }
      };
    }
  }, 500);

  pex.addEventHandler({
    event: "default-search-change",
    handler: function (e, args) {
      if (args == "person") {
        var querystring = pex.url.querystring();
        var phrase = pex.url.deparam(querystring).p || "";
        var options = { keyword: phrase };
        entities.search.route.go([], options);
      }
    }
  });
});
