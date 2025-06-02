# Como usar?

Clique [aqui](https://deyvib.github.io/MaquinaDeTuringND/) para acessar a máquina pelo Github Pages.

A especificação da máquina é dada em um arquivo .txt, a construção do .txt deve seguir da seguinte forma:

```
# txt que especifica a máquina de turing para reconhecer a linguagem a(3n)
estados: q0 q1 q2 q3 q4 qa qr
alfabeto: a
fitaAlfabeto:a ⊔
estadoInicial: q0
estadosAceita: qa
estadosRejeita: qr

# Ignorar ⊔ inicial
q0 ⊔ -> q1 * R

# A cada 3 movimentos (ou 0 no caso de palavra vazia) do cabeçote para a direita, voltamos para esse estado, se lermos vazio, é múltiplo de 3, se for a, continuamos contando mais 3 a's
q1 ⊔ -> qa ⊔ *
q1 a -> q2 * R

# Conta o 2° a, após a checagem de ser múltiplo
q2 a -> q3 * R
q2 ⊔ -> qr * *

# Conta o 3° a, para posteriormente voltar pro estado q1 e tentar achar o vazio e aceitar
q3 a -> q1 * R
q3 ⊔ -> qr * *

```

Após "estadosRejeita" até o final do arquivo ficam as transições, sempre separadas por "->", o lado esquerdo, uma tupla, contém o estado e o símbolo lido pelo cabeçote, o lado direito, uma tripla, corresponde a uma derivação a partir da configuração anterior, primeiro vêm o próximo estado, depois o símbolo para escrever e por fim a direção do movimento do cabeçote, R direita e L esquerda. Ao usar asterisco (*), você ignora o símbolo lido ou o símbolo a ser escrito ou ignora a movimentação do cabeçote naquela transição.

A pasta "machines" contém 4 arquivos .txt prontos com as linguagens:

> ww | w ∈ {0, 1}*;

> 𝑎^(2^n);

> Strings com dois a's ou 2 b's seguidos ∈ {a, b};

> 𝑎^(3n)

Você pode usá-las para testes, baixe o arquivo ou copie e cole para algum .txt do seu dispositivo, você também pode definir o número de passos máximos nas derivações e decidir durante o teste se continua ou não, nos arquivos das linguagens ww, e dois a's ou b's seguidos, existem loop's garantidos (utilizam não determinismo de forma que o cabeçote irá para a direita para sempre) então terá um ramo que existirá infinitamente, os outros dois arquivos descrevem uma máquina que decidem a linguagem, então não terá loop's, o campo de testes só aceita strings que possuem símbolos válidos no alfabeto da linguagem ou vazio (⊔).

# + Detalhes

O código utilizado na simulação da máquina de Turing não determinística foi feito com React (JavaScript), dado que eu precisaria gerenciar diversos estados e armazenar múltiplas configurações da máquina, decidi criar uma interface interativa para mostrar os resultados com mais facilidade e de uma forma mais limpa. Você pode ver toda a lógica na função simulate no arquivo App.jsx, a lógica para leitura do arquivo .txt e posterior armazenamento da especificação da máquina fica na função parseMachineFile.

> Como a parte direita da transição é uma tripla, é diferente da tupla que vimos na abordagem da disciplina (estado e movimento do cabeçote ou estado e simbolo para escrever), mas isso não é um problema, você só precisa garantir que exista um asterisco no simbolo escrito ou no movimento do cabeçote em todas as transições (q0 * L, q0 a *), assim, continuamos na convenção usada em sala de aula, então depende de como você construir a máquina no .txt, o exemplo acima (𝑎^(3n)) está dentro das convenções usadas na disciplina.
