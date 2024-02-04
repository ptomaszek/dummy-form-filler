function populate() {
    var here = document.documentElement;

    here.querySelectorAll('form').forEach(function (form) {
        form.reset();
    });

    here.querySelectorAll('input, select, textarea').forEach(function (input) {
        input.value = 'test';
    });
}
