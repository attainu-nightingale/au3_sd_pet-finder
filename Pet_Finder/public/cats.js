$.ajax({
    url: 'https://api.thecatapi.com/v1/breeds',
    type: 'GET',
    dataType: 'json',
    headers: { 'x-api-key': 'a9e89407-c340-4890-844e-7076d26bb0b1' },
    success: function (data) {
        for (let i = 0; i < data.length; i++) {
            $('#breed_select').append('<option id="' + data[i].id + '">' + data[i].name + '</option>')
        }



        $('select').on('change', function () {
            var id = $('option:selected').attr('id')
            $('#catImg').html("");
            $('.jumbotron').html("");

            $.ajax({
                url: 'https://api.thecatapi.com/v1/images/search?breed_ids=' + id,
                type: 'GET',
                dataType: 'json',
                headers: { 'x-api-key': 'a9e89407-c340-4890-844e-7076d26bb0b1' },
                success: function (result) {
<<<<<<< HEAD
                    $('#catImg').append('<img src="' + result[0].url + '" class="img-responsive img-resize">')
=======
                    $('#catImg').append('<img src="' + result[0].url + '" class="img-fluid">')
>>>>>>> 8f565edf4a55bcbfa4eb3c8f0f2f6e502c5f08f5
                }
            })


            for (let i = 0; i < data.length; i++) {
                if (data[i].id === id) {
                    $('.jumbotron').append('<h3 class="display-4">' + data[i].name + '</h3>')
                    $('.jumbotron').append('<p class="lead">' + data[i].description + '</p>')
                    $('.jumbotron').append('<hr class="my-4">')
                    $('.jumbotron').append('<p><strong>Origin Country</strong>: ' + data[i].origin + '</p>')
                    $('.jumbotron').append('<p><strong>Life Span</strong>: ' + data[i].life_span + ' years</p>')
                    $('.jumbotron').append('<p><strong>Temprament</strong>: ' + data[i].temperament + '</p>')
                    $('.jumbotron').append('<p><strong>Average Weight</strong>: ' + data[i].weight.metric + ' kg</p>')
                    break;
                }
            }


        })

    }
})


