// take user input for search term

// make ajax call to api

// return values that match the search term
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

search = {
    getQuestions: function(counter, term){
        var searchTerm = term;
        var url = "https://api.stackexchange.com/2.2/search?page="+counter+"&order=desc&sort=activity&intitle="+searchTerm+"&site=stackoverflow";
        $.getJSON(url, function(response){
            search.appendQs(response);
        })
        counter++
    },
    appendQs: function(arr){
        $("#questions").show()
        for (i=0; i<arr.items.length;i++){
            $("#questions").append("<p class='oneQuestion' id='"+ arr.items[i].question_id +"'><a href='#'>"+ arr.items[i].title + "</a>, " + arr.items[i].answer_count+ " answers</p>")
        }
        $(".oneQuestion").on("click", function(){
            search.getAnswers(this.id)
        })
        if (arr.quota_remaining){
            $("#questions").append("<p class='totalResponses'>There are more questions available!</p>")
            $(".getMore").show()
        }
    },
    getAnswers: function(id){
        var questionId = id;
        var url =
        "https://api.stackexchange.com/2.2/questions/"+questionId+"/answers?order=desc&filter=withbody&sort=activity&site=stackoverflow";
        $.getJSON(url, function(response){
            search.showAnswers(response)
        })
    },
    showAnswers: function(response){
        $(".answerBox").show()
        $("#answerHeader").children().remove();
        if (!response.items.length){
            $("#answerHeader").append("<p>No one has answered this question yet!</p>")
        }
        for (i=0; i<response.items.length;i++){
            $("#answerHeader").append("<div id='"+ i +"' class='anAnswer'>"+ response.items[i].body + "</div><hr>")
            if(response.items[i].is_accepted == true){
                $("#"+ i).css("border", "5px solid green")
                $("#"+ i).css("border-radius", "10px")
            }
        }
    }
}
