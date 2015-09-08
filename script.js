var counter = 1
$("#searchNow").on("click", function(e){
    e.preventDefault()
    counter = 1;
    searchTerm = $("#searchTerm").val();
    search.getQuestions(counter, searchTerm)
    $("#searchTerm").val("")
})

$(".getMore").on("click", function(e){
    console.log("here");
    e.preventDefault();
    search.getQuestions(counter, searchTerm)

})

// Object with all search functionality

search = {
    // returns the most-recent questions associated with a particular search term
    getQuestions: function(counter, term){
        var searchTerm = term;
        var url = "https://api.stackexchange.com/2.2/search?page="+counter+"&order=desc&sort=activity&intitle="+searchTerm+"&site=stackoverflow";
        $.getJSON(url, function(response){
            search.appendQs(response);
        })
        // increment the counter
        counter++
    },
    // append the question titles to the DOM
    appendQs: function(arr){
        $("#questions").show()
        // render each question idividually
        for (i=0; i<arr.items.length;i++){
            $("#questions").append("<p class='oneQuestion' id='"+ arr.items[i].question_id +"'><a href='#'>"+ arr.items[i].title + "</a>, " + arr.items[i].answer_count+ " answers</p>")
        }
        // have to put the event handler to display the answers in here, because the .oneQuestion DOM elements are rendered after the page loads
        $(".oneQuestion").on("click", function(){
            search.getAnswers(this.id)
        })
        // if there are more questions available that could be displayed, display this text and show the button that allows him/her to get more.
        if (arr.quota_remaining){
            $("#questions").append("<p class='totalResponses'>There are more questions available!</p>")
            $(".getMore").show()
        }
    },
    // get the answers associated with a particular question
    getAnswers: function(id){
        var questionId = id;
        var url =
        "https://api.stackexchange.com/2.2/questions/"+questionId+"/answers?order=desc&filter=withbody&sort=activity&site=stackoverflow";
        $.getJSON(url, function(response){
            search.showAnswers(response)
        })
    },
    // render the answers in the DOM
    showAnswers: function(response){
        $(".answerBox").show()
        $("#answerHeader").children().remove();
        // if there are no items in the response.items array, it indicates that there are no answers; display that info to the user
        if (!response.items.length){
            $("#answerHeader").append("<p>No one has answered this question yet!</p>")
        }
        // append all of the answers in the answer box
        for (i=0; i<response.items.length;i++){
            $("#answerHeader").append("<div id='"+ i +"' class='anAnswer'>"+ response.items[i].body + "</div><hr>")
            // if the answer being rendered has been "accepted", outline it with a green border to indicate
            if(response.items[i].is_accepted == true){
                $("#"+ i).css("border", "5px solid green")
                $("#"+ i).css("border-radius", "10px")
            }
        }
    }
}
