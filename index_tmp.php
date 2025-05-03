<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>diegopereirace (Em Construção)</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            background-color: #f8f9fa;
        }

        .social-icons a:hover {
            opacity: 0.8;
            transform: scale(1.1);
            transition: transform 0.2s ease-in-out;
        }
    </style>
</head>
<body>
    <header class="bg-light py-4 py-md-5" style="
/* This CSS code block is styling the header section of the webpage. Here's a breakdown of what each
property is doing: */
        width: 100%;
        height: auto;
        min-height: 600px;
        background-image: url('img/banner.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        text-align: center;">
        <div class="container text-center">
            <img src="img/logo-em-construcao.svg" alt="Em Construção" width="60" class="mb-3">
            <div id="dv-inner" style="position: relative;top: 172px;">
                <h1 class="display-4 text-muted">Página em Construção</h1>
                <p class="lead text-muted">Esta página está em desenvolvimento.</p>
            </div>
        </div>
    </header>

    <section class="py-5 bg-white">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-md-8 text-center">
                    <img src="img/perfil-placeholder.svg" alt="Foto de Perfil" class="img-fluid rounded-circle mb-3 mb-md-4" width="120">
                    <h2 class="mb-2">Diego Pereira</h2>
                    <p class="lead mb-3"><?php echo "Desenvolvedor Sênior. Especialista em PHP com foco em Drupal. Pós graduado em Análise, Projeto e Gerência de Sistemas."; ?></p>
                    <hr class="my-4">
                    <p class="mb-4">Mais informações em breve.</p>
                    <div class="social-icons">
                        <a href="https://www.linkedin.com/in/diegopereirace" target="_blank" class="text-muted mr-3"><i class="fab fa-linkedin fa-2x"></i></a>
                        <a href="https://github.com/diegopereirace" target="_blank" class="text-muted mr-3"><i class="fab fa-github fa-2x"></i></a>
                        <a href="mailto:diegopereirace@gmail.com" target="_blank" class="text-muted"><i class="fas fa-envelope fa-2x"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer class="bg-light py-3 text-center text-muted">
        <p class="mb-0">&copy; <?php echo date("Y"); ?> Diego Pereira. Todos os direitos reservados.</p>
    </footer>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.3/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script>
        $(document).ready(function() {
            // Pequena animação no hover dos ícones sociais (opcional, já implementado no CSS)
            // $('.social-icons a').hover(function() {
            //     $(this).animate({ opacity: 0.8, transform: 'scale(1.1)' }, 'fast');
            // }, function() {
            //     $(this).animate({ opacity: 1, transform: 'scale(1)' }, 'fast');
            // });
        });
    </script>
</body>
</html>