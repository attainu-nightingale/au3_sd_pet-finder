$.ajax({
    url: 'https://api.thedogapi.com/v1/breeds',
    type: 'GET',
    dataType: 'json',
    headers: { 'x-api-key': '23b2a58c-3a57-4b2b-8a12-9ee2a982aa59' },
    success: function (data) {
        for (let i = 0; i < data.length; i++) {
            $('#breed_select').append('<option id="' + data[i].id + '">' + data[i].name + '</option>')
        }

        $('select').on('change', function () {
            var id = $('option:selected').attr('id')
            $('#dogImg').html("");
            $('.jumbotron').html("");

            $.ajax({
                url: 'https://api.thedogapi.com/v1/images/search?include_breed=1&breed_id=' + id,
                type: 'GET',
                dataType: 'json',
                success: function (result) {
                    if (result.length == 0) {
                        $('#dogImg').append('<p>Sorry no image available for this breed yet</p>')
                    } else {
                        $('#dogImg').append('<img src="' + result[0].url + '" class="img-fluid">')
                    }
                }
            })

            for(let i = 0; i < data.length; i++) {
                if(data[i].id == id) {
                    $('.jumbotron').append('<h3 class="display-4">' + data[i].name + '</h3>')
                    $('.jumbotron').append('<p class="lead">' + data[i].bred_for + '</p>')
                    $('.jumbotron').append('<hr class="my-4">')
                    $('.jumbotron').append('<p><strong>Life Span</strong>: ' + data[i].life_span + '</p>')
                    $('.jumbotron').append('<p><strong>Temprament</strong>: ' + data[i].temperament + '</p>')
                    $('.jumbotron').append('<p><strong>Average Weight</strong>: ' + data[i].weight.metric + ' kg</p>')
                    $('.jumbotron').append('<p><strong>Average Height</strong>: ' + data[i].height.metric + ' cm</p>')
                    break;
                } 
            }
            


        })
    }
})






