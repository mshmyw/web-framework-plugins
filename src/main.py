#!/usr/bin/env python

import time
from datetime import timedelta
from tornado import httpclient, gen, ioloop, queues
from bs4 import BeautifulSoup
import requests
import re

import sys
reload(sys)
sys.setdefaultencoding('utf-8')


concurrency = 2
base_url = 'https://www.liepin.com/zhaopin/?ckid=dce200fb6c15a366&fromSearchBtn=2&degradeFlag=0&init=-1&searchField=1&headckid=dce200fb6c15a366&d_pageSize=40&siTag=p_XzVCa5J0EfySMbVjghcw~fA9rXquZc5IkJpXC-Ycixw&d_headId=108ff647d04f399318108df7bc7cfafd&d_ckId=108ff647d04f399318108df7bc7cfafd&d_sfrom=search_fp&d_'
base_url_list = [base_url +  '&&key={search_key}&curPage={cur_page}'.format(
    search_key = 'Python', cur_page = cur_page) for cur_page in xrange(1, concurrency)]

@gen.coroutine
def get_html_from_url(url):
    try:
        # response = httpclient.HTTPClient().fetch(url)  # sync fetch
        response = yield httpclient.AsyncHTTPClient().fetch(url)  # async fetch
        # print('fetched %s' % url)
        html = response.body if isinstance(response.body, str) \
            else response.body.decode()

    except Exception as e:
        print('Exception: %s %s' % (e, url))
        raise gen.Return('')

    raise gen.Return(html)

def get_links_from_html(html):
    links = []
    bsobj = BeautifulSoup(html, 'lxml')
    for jobinfo in bsobj.find('ul', class_='sojob-list').find_all('h3'):
        link = jobinfo.find('a')['href']
        links.append(link)
    return links

@gen.coroutine
def get_links_from_url(url):
    """Download the page at `url` and parse it for links,Returned links.
    """

    html = yield get_html_from_url(url)
    if len(html):
        links = get_links_from_html(html)
        raise gen.Return(links)
    raise gen.Return('')

def get_info_from_html(html):
    recruit_info = {}
    bsobj = BeautifulSoup(html, 'lxml')
    job_info = bsobj.find('div', class_='title-info')
    company = job_info.find('h3').find('a')
    reg1 = re.compile("<[^>]*>")

    company = reg1.sub('', company.prettify()).strip('\n').strip()
    recruit_info['company'] = company

    job = job_info.find('h1')
    reg2 = re.compile("<[^>]*>")
    job = reg2.sub('', job.prettify()).strip('\n')
    recruit_info['job'] = job
    return recruit_info

@gen.coroutine
def get_res_from_url(url):
    """Download the page at `url` and parse it for links,Returned links.
    """

    html = yield get_html_from_url(url)
    if len(html):
        recruit_info = get_info_from_html(html)
        raise gen.Return(recruit_info)
    raise gen.Return({})

@gen.coroutine
def main():
    q = queues.Queue()
    start = time.time()
    fetching, fetched = set(), set()
    fetched_links = set()
    
    sq = queues.Queue()

    @gen.coroutine
    def fetch_url():
        current_url = yield q.get()
        try:
            if current_url in fetching:
                return

            # print('fetching %s' % current_url)
            fetching.add(current_url)
            links = yield get_links_from_url(current_url)
            for link in links:
                fetched_links.add(link)
            fetched.add(current_url)

        finally:
            q.task_done()

    @gen.coroutine
    def worker():
        while True:
            yield fetch_url()

    for base_url in base_url_list:
        q.put(base_url)

    # Start workers, then wait for the work queue to be empty.
    for cur_page in xrange(1, concurrency):
        worker()
    yield q.join(timeout=timedelta(seconds=300))
    assert fetching == fetched
    print('Done in %d seconds, fetched %s URLs.' % (
        time.time() - start, len(fetched)))

    @gen.coroutine
    def sworker():
        while True:
            current_url = yield sq.get()
            try:
                # print('fetching %s' % current_url)
                fetching.add(current_url)
                recruit_info = yield get_res_from_url(current_url)
                print recruit_info
            finally:
                sq.task_done()

    # # deal all links, get job info
    for link in fetched_links:
        sq.put(link)
    for link in fetched_links:
        sworker()
    yield sq.join(timeout=timedelta(seconds=600))
    print '--OVER--'

if __name__ == '__main__':
    io_loop = ioloop.IOLoop.current()
    print '--- start travis ci ---'
    io_loop.run_sync(main)
