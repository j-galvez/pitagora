package PitagoraBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import PitagoraBackend.model.Tickets;

@Repository
public interface TicketsRepository extends JpaRepository <Tickets, Integer>{

}
