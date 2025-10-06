$(document).ready(function () {
  function buildHtmlFromResp(data) {
    if (data.error) {
      return '<div class="alert alert-danger">' + data.error + '</div>';
    }
    var r = data.resultado;
    var p = data.procesos;
    var pasos = data.pasos || [];
    var html = '';
    html += '<h5>Resultados</h5>';
    html += '<table class="table table-bordered"><tr><th>Probabilidad total de rojo</th><td>' + r.p_total_rojo + '</td></tr>';
    html += '<tr><th>P(Rojo | Cubo)</th><td>' + r.p_condicional_rojo_dado_cubo + '</td></tr></table>';

    // formula (insertamos dentro de script type math/tex)
    html += '<h6>Fórmula (LaTeX)</h6>';
    html += '<script type="math/tex; mode=display">' + data.formula + '</script>';

    // procesos
    html += '<h6 class="mt-3">Procesos y valores</h6>';
    html += '<table class="table table-striped">';
    html += '<tbody>';
    html += '<tr><td>Total balotas</td><td>' + p.total_balotas + '</td></tr>';
    html += '<tr><td>Total cubos</td><td>' + p.total_cubos + '</td></tr>';
    html += '<tr><td>Total objetos</td><td>' + p.total_objetos + '</td></tr>';
    html += '<tr><td>P(Balota)</td><td>' + p.p_balota + '</td></tr>';
    html += '<tr><td>P(Cubo)</td><td>' + p.p_cubo + '</td></tr>';
    html += '</tbody></table>';

    // pasos (no usamos <pre> para que MathJax pueda procesar LaTeX)
    html += '<h6>Explicación paso a paso</h6><ol>';
    pasos.forEach(function (paso) {
      html += '<li><div>' + paso + '</div></li>';
    });
    html += '</ol>';
    return html;
  }

  // botón AJAX: toma los valores y llama a /api/calcular
  $('#ajax-btn').on('click', function () {
    var data = {
      balotas_rojas: Number($('input[name=balotas_rojas]').val()) || 0,
      balotas_azules: Number($('input[name=balotas_azules]').val()) || 0,
      cubos_rojos: Number($('input[name=cubos_rojos]').val()) || 0,
      cubos_azules: Number($('input[name=cubos_azules]').val()) || 0
    };
    $.ajax({
      url: '/api/calcular',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function (resp) {
        $('#resultados').html(buildHtmlFromResp(resp));
        if (window.MathJax) {
          MathJax.typesetPromise();
        }
      },
      error: function (xhr) {
        var msg = 'Error en la petición';
        try { msg = xhr.responseJSON.error || msg; } catch (e) {}
        $('#resultados').html('<div class="alert alert-danger">' + msg + '</div>');
      }
    });
  });

});
