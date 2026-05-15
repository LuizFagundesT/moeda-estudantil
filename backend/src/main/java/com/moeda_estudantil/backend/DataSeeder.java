package com.moeda_estudantil.backend;

import com.moeda_estudantil.backend.entity.Aluno;
import com.moeda_estudantil.backend.entity.EmpresaParceira;
import com.moeda_estudantil.backend.entity.Endereco;
import com.moeda_estudantil.backend.entity.Vantagem;
import com.moeda_estudantil.backend.enums.TipoUsuario;
import com.moeda_estudantil.backend.repository.AlunoRepository;
import com.moeda_estudantil.backend.repository.EmpresaParceiraRepository;
import com.moeda_estudantil.backend.repository.VantagemRepository;
import com.moeda_estudantil.backend.entity.Professor;
import com.moeda_estudantil.backend.enums.TipoUsuario;
import com.moeda_estudantil.backend.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final EmpresaParceiraRepository empresaRepository;
    private final AlunoRepository alunoRepository;
    private final VantagemRepository vantagemRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProfessorRepository professorRepository;

    @Override
    public void run(String... args) {
        EmpresaParceira cantina = criarEmpresaSeNaoExiste(
                "cantina@kronos.com",
                "Cantina Kronos",
                "Cantina Kronos LTDA",
                "11222333000144",
                "31999990001");

        EmpresaParceira livraria = criarEmpresaSeNaoExiste(
                "livraria@kronos.com",
                "Livraria Campus",
                "Livraria Campus LTDA",
                "22333444000155",
                "31999990002");

        criarAlunoSeNaoExiste(
                "aluno.saldo@kronos.com",
                "Aluno Com Saldo",
                "11122233344",
                "2026001",
                700.0);

        criarAlunoSeNaoExiste(
                "aluno.semsaldo@kronos.com",
                "Aluno Sem Saldo",
                "55566677788",
                "2026002",
                0.0);

        criarVantagemSeNaoExiste(cantina, "20% de desconto no almoço",
                "Desconto válido para uma refeição presencial na cantina parceira.", 120,
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop", 10);
        criarVantagemSeNaoExiste(cantina, "Combo lanche especial",
                "Troque suas moedas por um combo com sanduíche, bebida e sobremesa.", 180,
                "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop", 5);
        criarVantagemSeNaoExiste(livraria, "Desconto em material acadêmico",
                "Cupom para compra presencial de cadernos, canetas e materiais de estudo.", 200,
                "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=1200&auto=format&fit=crop", 8);
        criarVantagemSeNaoExiste(livraria, "Vale livro técnico",
                "Benefício para abater parte do valor de um livro técnico selecionado.", 350,
                "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop", 2);
        criarVantagemSeNaoExiste(livraria, "Vantagem esgotada para teste",
                "Item com quantidade zero para testar bloqueio de resgate.", 50,
                "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=1200&auto=format&fit=crop", 0);

        if (professorRepository.count() == 0) {

            Professor prof1 = new Professor();
            prof1.setNome("João Silva");
            prof1.setEmail("joao.silva@pucminas.br");
            prof1.setSenha(passwordEncoder.encode("http://localhost:8080/professores/1/extrato")); // use seu PasswordEncoder
            prof1.setCpf("111.222.333-44");
            prof1.setDepartamento("Engenharia de Software");
            prof1.setUniversidade("PUC Minas");
            prof1.setSaldoMoedas(1000.0); // saldo inicial do semestre
            prof1.setTipo(TipoUsuario.PROFESSOR);
            professorRepository.save(prof1);

            Professor prof2 = new Professor();
            prof2.setNome("Maria Oliveira");
            prof2.setEmail("maria.oliveira@pucminas.br");
            prof2.setSenha(passwordEncoder.encode("senha123"));
            prof2.setCpf("555.666.777-88");
            prof2.setDepartamento("Ciência da Computação");
            prof2.setUniversidade("PUC Minas");
            prof2.setSaldoMoedas(1000.0);
            prof2.setTipo(TipoUsuario.PROFESSOR);
            professorRepository.save(prof2);

            System.out.println(" Professores seedados com sucesso via DataSeeder");
        }
    }

    private EmpresaParceira criarEmpresaSeNaoExiste(String email, String nome, String nomeFantasia, String cnpj,
            String cpf) {
        return empresaRepository.findByEmail(email).orElseGet(() -> {
            EmpresaParceira empresa = new EmpresaParceira();
            empresa.setNome(nome);
            empresa.setNomeFantasia(nomeFantasia);
            empresa.setEmail(email);
            empresa.setSenha(passwordEncoder.encode("123456"));
            empresa.setCnpj(cnpj);
            empresa.setCpf(cpf);
            empresa.setTipo(TipoUsuario.EMPRESA_PARCEIRA);
            empresa.setEndereco(enderecoPadrao());
            return empresaRepository.save(empresa);
        });
    }

    private void criarAlunoSeNaoExiste(String email, String nome, String cpf, String matricula, Double saldo) {
        alunoRepository.findByEmail(email).orElseGet(() -> {
            Aluno aluno = new Aluno();
            aluno.setNome(nome);
            aluno.setEmail(email);
            aluno.setSenha(passwordEncoder.encode("123456"));
            aluno.setCpf(cpf);
            aluno.setMatricula(matricula);
            aluno.setRg("MG" + matricula);
            aluno.setCurso("Engenharia de Software");
            aluno.setInstituicao("PUC Minas");
            aluno.setSaldoMoedas(saldo);
            aluno.setTipo(TipoUsuario.ALUNO);
            aluno.setEndereco(enderecoPadrao());
            return alunoRepository.save(aluno);
        });
    }

    private void criarVantagemSeNaoExiste(EmpresaParceira empresa, String titulo, String descricao, Integer custo,
            String fotoUrl, Integer quantidade) {
        boolean jaExiste = vantagemRepository.findByEmpresaParceiraIdOrderByIdDesc(empresa.getId())
                .stream()
                .anyMatch(v -> v.getTitulo().equalsIgnoreCase(titulo));

        if (jaExiste)
            return;

        Vantagem vantagem = new Vantagem();
        vantagem.setEmpresaParceira(empresa);
        vantagem.setTitulo(titulo);
        vantagem.setDescricao(descricao);
        vantagem.setCustoMoedas(custo);
        vantagem.setFotoUrl(fotoUrl);
        vantagem.setQuantidadeDisponivel(quantidade);
        vantagem.setAtiva(true);
        vantagemRepository.save(vantagem);
    }

    private Endereco enderecoPadrao() {
        Endereco endereco = new Endereco();
        endereco.setLogradouro("Av. Dom José Gaspar");
        endereco.setNumero("500");
        endereco.setBairro("Coração Eucarístico");
        endereco.setCidade("Belo Horizonte");
        endereco.setEstado("MG");
        endereco.setCep("30535-901");
        endereco.setPais("Brasil");
        return endereco;
    }
}
