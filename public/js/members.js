$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then((data) => {
    $(".member-name").text(data.first);
    $(".member-avatar").html(
      `<img src="https://avatars.dicebear.com/api/bottts/${data.id}.svg" width="40px" height="100%" class="avatar-pic" />`
    );
  });

  $("input[name=filterChoices]").on("change", () => {
    if ($("input[name=filterChoices]:checked").val() === "option1") {
      $("#byParent").removeClass("hidden");
      $("#byCategory").addClass("hidden");
      $("#byGrade").addClass("hidden");
      $("#bySchool").addClass("hidden");
      $("#byDistrict").addClass("hidden");
    } else if ($("input[name=filterChoices]:checked").val() === "option2") {
      $("#byCategory").removeClass("hidden");
      $("#byParent").addClass("hidden"); // Hide Filter By Parent Form
      $("#byGrade").addClass("hidden"); // Hide Filter By Grade Form
      $("#bySchool").addClass("hidden"); // Hide Filter By School Form
      $("#byDistrict").addClass("hidden"); //Hide Filter By District Form
      $("#current").addClass("hidden"); //Hide Latest Posts
    } else if ($("input[name=filterChoices]:checked").val() === "option3") {
      $("#byGrade").removeClass("hidden");
      $("#byParent").addClass("hidden");
      $("#byCategory").addClass("hidden");
      $("#bySchool").addClass("hidden");
      $("#byDistrict").addClass("hidden");
    } else if ($("input[name=filterChoices]:checked").val() === "option4") {
      $("#bySchool").removeClass("hidden");
      $("#byParent").addClass("hidden");
      $("#byCategory").addClass("hidden");
      $("#byGrade").addClass("hidden");
      $("#byDistrict").addClass("hidden");
    } else if ($("input[name=filterChoices]:checked").val() === "option5") {
      $("#byDistrict").removeClass("hidden");
      $("#byParent").addClass("hidden");
      $("#byCategory").addClass("hidden");
      $("#byGrade").addClass("hidden");
      $("#bySchool").addClass("hidden");
    } else if ($("input[name=filterChoices]:checked").val() === "option6") {
      $("#byDistrict").addClass("hidden");
      $("#byParent").addClass("hidden");
      $("#byCategory").addClass("hidden");
      $("#byGrade").addClass("hidden");
      $("#bySchool").addClass("hidden");
    } else {
      console.log("Error; no radio selection exists.");
    }
  });

  function renderReply(reply) {
    let results = reply;
    $("#results").empty();
    results.forEach((post) => {
      $("#results").append(`
        <div class="text-left mb-4 px-2">
          <img class="avatar-pic" src="https://avatars.dicebear.com/api/bottts/${
            post.UserId
          }}.svg" width="30px" height="100%" />
          <a class="btn btn-link" data-toggle="collapse" href="#id${
            post.id
          }" role="button" aria-expanded="false" aria-controls="id${post.id}">
            <strong>${post.title}</strong>
          </a> 
          <a class="btn btn-link" data-toggle="modal" data-target="#m${
            post.id
          }"><i class="fas fa-external-link-alt"></i></a>
          <br>
          <span class="small pl-2">${post.createdAt}</span><br>
          <span class="small pl-2">Category: </span><span class="badge badge-light">${
            post.category
          }</span> | <span class="small"></span>Parent Poster: ${post.UserId}<span class="badge badge-light">${
        post.User.first
      } ${post.User.last}</span> <br>
          <span class="badge badge-light">${post.grade ||
            ""}</span>&nbsp;<span class="badge badge-light">${post.school ||
        ""}</span>&nbsp;<span class="badge badge-light">${post.district || ""}</span>
          <div class="collapse" id="id${post.id}">
            <div class="card card-body">
              ${post.body}

              <span class="small"><em>Open post (<i class="fas fa-external-link-alt"></i>) to view accompanying post links if available.</span>
            </div>
          </div>
        <!-- Modal -->
        <div class="modal fade" id="m${post.id}" tabindex="-1" aria-labelledby="m${post.id}Label" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-scrollable">
            <div class="modal-content">  
              <div class="modal-body">
                <div class="post-top">
                  <h5 class="modal-title" id="m${post.UserId}Label">${post.title}</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <span class="small pl-2">${post.createdAt}</span><br>
                  <img class="avatar-pic" src="https://avatars.dicebear.com/api/bottts/${
                    post.UserId
                  }.svg" width="30px" height="100%" /> <span class="small">Parent Poster: </span><span class="badge badge-light">${
        post.UserId
      } ${post.User.first} ${post.User.last}</span>
                  <hr>
                  <span class="small">Category: </span><span class="badge badge-light">${
                    post.category
                  }</span>&nbsp;<span class="badge badge-light">${post.grade ||
        ""}</span>&nbsp;<span class="badge badge-light">${post.school ||
        ""}</span>&nbsp;<span class="badge badge-light">${post.district || ""}</span>
                  <hr>
                </div>
                ${post.body}
                <br>
                ${post.link}
                ${post.linkframe}
              </div>
            </div>
          </div>
        </div>
        </div>`);
    });
  }

  // On click/submit of the By Parent Filter Form, Add the Parent dynamically to the results title,
  // show the parent results block and hide all other blocks
  $("#user-filter-button").on("click", () => {
    event.preventDefault();
    let parentName = $("#userFilterInput").val();
    $("#parentNameSpan").text(`Posts from ${parentName}`);
    $("#searchResults").removeClass("hidden");
    $("#categoryFilterResults").addClass("hidden");
    $("#current").addClass("hidden");
    $("#parentFilterResults").addClass("hidden");
    $("#gradeFilterResults").addClass("hidden");
    $("#schoolFilterResults").addClass("hidden");
    $("#districtFilterResults").addClass("hidden");
    $.ajax(`/api/posts-user/${parentName}`).done((reply) => {
      renderReply(reply);
    });
  });

  // On click/submit of the By Grade Filter Form, Add the Grade dynamically to the results title,
  // show the grade results block and hide all other blocks
  $("#grade-filter-button").on("click", () => {
    event.preventDefault();
    let gradeSelection = $("#gradeFilterInput").val();
    $("#gradeSelectionSpan").text(`Results for Grade: ${gradeSelection}`);
    $("#searchResults").addClass("hidden");
    $("#categoryFilterResults").addClass("hidden");
    $("#current").addClass("hidden");
    $("#parentFilterResults").addClass("hidden");
    $("#gradeFilterResults").removeClass("hidden");
    $("#schoolFilterResults").addClass("hidden");
    $("#districtFilterResults").addClass("hidden");
    $.ajax(`/api/posts-grade/${gradeSelection}`).done((reply) => {
      renderReply(reply);
    });
  });

  // On click/submit of the By School Filter Form, Add the name dynamically to the results title,
  // show the school results block and hide all other blocks
  $("#school-filter-button").on("click", () => {
    event.preventDefault();
    let schoolName = $("#schoolFilterInput").val();
    $("#schoolNameSpan").text(`Results for: "${schoolName}"`);
    $("#searchResults").addClass("hidden");
    $("#categoryFilterResults").addClass("hidden");
    $("#current").addClass("hidden");
    $("#parentFilterResults").addClass("hidden");
    $("#gradeFilterResults").addClass("hidden");
    $("#schoolFilterResults").removeClass("hidden");
    $("#districtFilterResults").addClass("hidden");
    $.ajax(`/api/posts-school/${schoolName}`).done((reply) => {
      renderReply(reply);
    });
  });

  // On click/submit of the By District Filter Form, Add the name dynamically to the results title,
  // show the district results block and hide all other blocks
  $("#district-filter-button").on("click", () => {
    event.preventDefault();
    let districtName = $("#districtFilterInput").val();
    $("#districtNameSpan").text(`Results for: "${districtName}" School District`);
    $("#searchResults").addClass("hidden");
    $("#categoryFilterResults").addClass("hidden");
    $("#current").addClass("hidden");
    $("#parentFilterResults").addClass("hidden");
    $("#gradeFilterResults").addClass("hidden");
    $("#schoolFilterResults").addClass("hidden");
    $("#districtFilterResults").removeClass("hidden");
    $.ajax(`/api/posts-district/${districtName}`).done((reply) => {
      renderReply(reply);
    });
  });

  // On submission of the search form, add terms search dynamically the results title,
  // show search results block and hide all other blocks
  $("#searchForm").on("submit", () => {
    event.preventDefault();
    let searchTerm = $("#searchInput").val();
    console.log(searchTerm);
    $("#searchTermSpan").text(`You searched for: "${searchTerm}"`);
    $("#searchResults").removeClass("hidden");
    $("#categoryFilterResults").addClass("hidden");
    $("#current").addClass("hidden");
    $("#parentFilterResults").addClass("hidden");
    $("#gradeFilterResults").addClass("hidden");
    $("#schoolFilterResults").addClass("hidden");
    $("#districtFilterResults").addClass("hidden");
    $.ajax(`/api/posts/${searchTerm}`).done((reply) => {
      renderReply(reply);
    });
  });

  // On Change of the Category Selection, Add the name dynamically to the results title,
  // show the category results block and hide all other blocks
  $("#category-filter-button").on("click", () => {
    event.preventDefault();
    let catName = $("#categoryFilterInput").val();
    $("#categoryNameSpan").text(`${catName} Category Results`);
    $("#categoryFilterResults").removeClass("hidden"); // SHOW category results
    $("#current").addClass("hidden");
    $("#parentFilterResults").addClass("hidden");
    $("#gradeFilterResults").addClass("hidden");
    $("#schoolFilterResults").addClass("hidden");
    $("#districtFilterResults").addClass("hidden");
    $("#searchResults").addClass("hidden");
    $.ajax(`/api/posts-category/${catName}`).done((reply) => {
      renderReply(reply);
    });
  });
});
