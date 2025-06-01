# Como usar?

Clique [aqui](https://deyvib.github.io/MaquinaDeTuringND/) para acessar a máquina pelo github pages

A especificação da máquina é dada em um arquivo .txt, a construção do .txt deve seguir da seguinte forma:

```

estados: q0 q1 ....
alfabeto: a b ....
fitaAlfabeto: a b ⊔ ⊳  ....
estadoInicial: q0
estadosAceita: qa
estadosRejeita: qr

q0 a -> q1 * R

...

```

Após "estadosRejeita", até o final do arquivo, ficam as transições, sempre separadas por ->, o lado esquerdo, uma tupla, contém o estado e o simbolo lido pelo cabeçote, o lado direito, uma tripla, corresponde a uma derivação a partir da configuração anterior, primeiro vem o próximo estado, depois o simbolo para escrever e por fim a direção do movimento do cabeçote, R direita, L esquerda, ao usar asterisco (*), você ignora o simbolo lido, o simbolo a ser escrito ou ignora a movimentação do cabeçote naquela transição

Na pasta "machines" contem 4 arquivos .txt prontos com as linguagens ww, a(2^n), strings com dois a's ou 2 b's seguidos e a linguagem a(3n), você pode usá-las para testes, baixe o arquivo ou copie e cole para algum .txt do seu dispositivo, você também pode definir o número de passos máximos nas derivações e decidir durante o teste se continua ou não, nos arquivos das linguagens ww, e dois a's ou b's seguidos, existem loop's garantidos (utilizam não determinismo) então terá um ramo que existirá infinitamente, os outros dois arquivos descrevem uma máquina que decidem a linguagem, então não terá loops, o campo de testes só aceita strings que possuem simbolos válidos no alfabeto da linguagem ou vazio (⊔)

# + Detalhes

O código utilizado na simulação da máquina de Turing não determinística foi feito com React (JavaScript), dado que eu precisaria gerenciar diversos estados e armazenar múltiplas configurações da máquina, decidi criar uma interface interativa para mostrar os resultados com mais facilidade e de uma forma mais limpa. Você pode ver toda a lógica na função simulate no arquivo App.jsx, a lógica para leitura do arquivo .txt e posteriormente armazenamento da especificação da máquina fica na função parseMachineFile
