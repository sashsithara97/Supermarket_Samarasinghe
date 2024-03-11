package com.samarasinghesuper.repository;

import com.samarasinghesuper.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReportRepository extends JpaRepository<Supplier,Integer> {

    @Query(value = "select new Supplier(s.companyname,s.ariasamount) from Supplier s ")
    List<Supplier> supplierArrieaseList();

    //SELECT year(s.paiddatetime),monthname(s.paiddatetime),date(s.paiddatetime),sum(s.paidamount) FROM samarasinghesuper.payment as s where date(s.paiddatetime) between '2022--05-20' and '2022--06-20' group by month(s.paiddatetime) ;
@Query(value = "SELECT year(s.paiddatetime),monthname(s.paiddatetime),date(s.paiddatetime),sum(s.paidamount) FROM samarasinghesuper.payment as s where date(s.paiddatetime) between ?1 and ?2 group by month(s.paiddatetime) ;",nativeQuery = true)
List monthlyExpences(String sdate,String edate);

@Query(value = "SELECT year(s.paiddatetime),week(s.paiddatetime),date(s.paiddatetime),sum(s.paidamount) FROM samarasinghesuper.payment as s where date(s.paiddatetime) between ?1 and ?2 group by week(s.paiddatetime) ;",nativeQuery = true)
 List weeklyExpences(String sdate,String edate);

//SELECT monthname(p.paiddatetime),week(p.paiddatetime),year(p.paiddatetime),day(p.paiddatetime),sum(p.paidamount) from samarasinghesuper.payment as p where p.paiddatetime between '2022-05-01' and '2022-07-01' group by day(p.paiddatetime) ;
@Query(value = "SELECT year(s.paiddatetime),week(s.paiddatetime),day(s.paiddatetime),sum(s.paidamount) FROM samarasinghesuper.payment as s where date(s.paiddatetime) between ?1 and ?2 group by day(s.paiddatetime) ;",nativeQuery = true)
List DailyExpences(String sdate,String edate);

//Monthly/Daily/Yearly/Weekly Income
/*    SELECT day(i.createddatetime),monthname(i.createddatetime),week(i.createddatetime),year(i.createddatetime),sum(i.netamount) FROM samarasinghesuper.invoice as i where i.createddatetime between '2022-05-01' and
'2022-07-01' group by day(i.createddatetime);*/
@Query(value = "SELECT year(i.createddatetime),day(i.createddatetime),week(i.createddatetime),sum(i.netamount) FROM samarasinghesuper.invoice as i where date(i.createddatetime) between ?1 and ?2 group by day(i.createddatetime) ;",nativeQuery = true)
List DailyIncome(String sdate,String edate);

    @Query(value = "SELECT year(i.createddatetime),day(i.createddatetime),week(i.createddatetime),sum(i.netamount) FROM samarasinghesuper.invoice as i where date(i.createddatetime) between ?1 and ?2 group by week(i.createddatetime) ;",nativeQuery = true)
    List WeeklyIncome(String sdate,String edate);

    @Query(value = "SELECT year(i.createddatetime),day(i.createddatetime),week(i.createddatetime),sum(i.netamount) FROM samarasinghesuper.invoice as i where date(i.createddatetime) between ?1 and ?2 group by month(i.createddatetime) ;",nativeQuery = true)
    List MonthlyIncome(String sdate,String edate);


    @Query(value = "SELECT i.itemcode,i.itemname,b.expdate,b.avaqty FROM samarasinghesuper.batch as b,samarasinghesuper.item as i where i.id=b.item_id and (b.expdate >= curdate() and b.expdate <= (curdate() + interval 10 day));",nativeQuery = true)
    List getNearExpireItem();




}
