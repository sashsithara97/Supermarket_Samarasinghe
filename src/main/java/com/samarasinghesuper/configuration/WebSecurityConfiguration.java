package com.samarasinghesuper.configuration;



import com.samarasinghesuper.service.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private MyUserDetailsService userDetailsService;



    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .userDetailsService(userDetailsService)
                .passwordEncoder(bCryptPasswordEncoder);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.
                authorizeRequests()
                .antMatchers("/").permitAll()
                .antMatchers("/resources/**").permitAll()
                .antMatchers("/login").permitAll()
                .antMatchers("/registration").permitAll()
                .antMatchers("/forgotpassword").permitAll()
                .antMatchers("/user/getuser/**").permitAll()
                .antMatchers("/config","/user/getAdmin").permitAll()

                .antMatchers("/dashboard").permitAll()

                .antMatchers("/item/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","PROCUREMENTMANAGER")
                .antMatchers("/customer/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","PROCUREMENTMANAGER")
                .antMatchers("/supplier/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","PROCUREMENTMANAGER")
                .antMatchers("/supplierreturn/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","PROCUREMENTMANAGER")
                .antMatchers("/quotationrequest/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","PROCUREMENTMANAGER")
                .antMatchers("/quotation/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","PROCUREMENTMANAGER")
                .antMatchers("/porder/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","PROCUREMENTMANAGER")
                .antMatchers("/grn/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","PROCUREMENTMANAGER")
                .antMatchers("/payment/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","PROCUREMENTMANAGER")
                .antMatchers("/batch/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","PROCUREMENTMANAGER","CASHIER")

                .antMatchers("/expences/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","PROCUREMENTMANAGER")
                .antMatchers("/income/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","PROCUREMENTMANAGER")
                .antMatchers("/uisupplierarrease/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","PROCUREMENTMANAGER")

                .antMatchers("/corder/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","PROCUREMENTMANAGER","CASHIER")
                .antMatchers("/invoice/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","PROCUREMENTMANAGER","CASHIER")


                .antMatchers("/user/**","/employee/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","PROCUREMENTMANAGER")
                .antMatchers("/mainwindow").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","PROCUREMENTMANAGER")
                .antMatchers("/privilage/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","PROCUREMENTMANAGER").anyRequest().authenticated()
                .and().csrf().disable().formLogin()
                .loginPage("/login")
                .failureHandler((request, response, exception) -> {
                    System.out.println(exception.getMessage());
                    System.out.println(response.getStatus());
                    String redirectUrl = new String();
                    if(exception.getMessage() == "User is disabled"){
                        redirectUrl = request.getContextPath() + "/login?error=notactive";
                    }else if(exception.getMessage() == "Bad credentials"){
                        redirectUrl = request.getContextPath() + "/login?error=detailserr";
                    }else if(exception.getMessage() == null){
                        redirectUrl = request.getContextPath() + "/login?error=detailserr";
                    }
                    response.sendRedirect(redirectUrl);
                })
                .defaultSuccessUrl("/mainwindow", true)
                .usernameParameter("username")
                .passwordParameter("password")
                .and().logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/login").and().exceptionHandling().accessDeniedPage("/access-denied").and()
                .sessionManagement()
                .invalidSessionUrl("/login")
                .sessionFixation()
                .changeSessionId()
                .maximumSessions(6)
                .expiredUrl("/login").maxSessionsPreventsLogin(true);
        ;
        http.headers()
                .addHeaderWriter(new XFrameOptionsHeaderWriter(XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN));
    }
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        return bCryptPasswordEncoder;
    }
/*    @Bean
    public ViewResolver internalResourceViewResolver() {
        InternalResourceViewResolver bean = new InternalResourceViewResolver();
        bean.setPrefix("/resources/**");
        bean.setSuffix(".html");
        return bean;
    }*/

}
